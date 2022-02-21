const express = require("express")
const Article = require("./../models/article")
const router = express.Router()
const { checkAuthenticated } = require("../config/auth")
let article = null

router.get("/new", checkAuthenticated, (req, res) => {
  res.render("articles/new", { article: new Article() })
})

router.get("/edit/:id", checkAuthenticated, async (req, res) => {
  const article = await Article.findById(req.params.id)
  res.render("articles/edit", { article: article })
})

router.get("/:slug", async (req, res) => {
  await Article.findOne({ slug: req.params.slug })
    .then((article) => {
      if (article == null) res.redirect("/") //if there is no ID go back to main page
      res.render("articles/show", { article: article })
    })
    .catch((e) => {
      res.send(e)
    })
})

router.post("/",
  checkAuthenticated,
  async (req, res, next) => {
    req.article = new Article()
    next()
  },
  saveArticleAndRedirect("new")
)

router.put("/:id",
  checkAuthenticated,
  async (req, res, next) => {
    req.article = await Article.findById(req.params.id)
    next()
  },
  saveArticleAndRedirect("edit")
)

router.delete("/:id", checkAuthenticated, async (req, res) => {
  await Article.findByIdAndDelete(req.params.id)
  res.redirect("/")
})

function saveArticleAndRedirect(path) {
  return async (req, res) => {
    let article = req.article
    const user = await req.user
    //console.log(user.username)
    article.user_id = user._id
    article.title = req.body.title
    article.description = req.body.description
    article.markdown = req.body.markdown
    try {
      article = await article.save()
      res.redirect(`/articles/${article.slug}`)
    } catch (e) {
      // TODO show user the err
      console.log(e)
      res.render(`articles/${path}`, { article: article })
    }
  }
}

module.exports = router
