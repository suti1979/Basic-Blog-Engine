const express = require("express")
const router = express.Router()
const Article = require("./../models/article")
const User = require("./../models/users")
const bcrypt = require("bcrypt")
const passport = require("passport")

const { checkNotAuthenticated, checkNotLoggedIn } = require("../config/auth")

router.get("/", async (req, res) => {
  const articles = await Article.find().sort({ createdAt: "desc" })
  const user = await req.user
  if (user != null)
    res.render("articles/index", { articles: articles, user: user.username, user_id: user._id })
  else res.render("articles/index", { articles: articles, user: null, user_id: null })
})

router.get("/register", checkNotLoggedIn, (req, res) => {
  res.render("register")
})

router.get("/login", checkNotLoggedIn, (req, res) => {
  res.render("login")
})

router.post("/register", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    let user = new User()
    user.username = req.body.username
    user.email = req.body.email
    user.password = hashedPassword
    user.save()

    res.redirect("/login")
  } catch {
    res.redirect("/register")
  }
})

router.post(
  "/login",
  checkNotAuthenticated,
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
)

router.delete("/logout", (req, res) => {
  req.logOut() //session function
  res.redirect("/")
})

module.exports = router
