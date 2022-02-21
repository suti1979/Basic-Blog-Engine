const express = require("express")
const router = express.Router()
const Article = require("./../models/article")
const User = require("./../models/users")
const bcrypt = require("bcrypt")
const passport = require("passport")
const { checkNotAuthenticated, checkNotLoggedIn } = require("../config/auth")

router.get("/", async (req, res) => {

  const user = await req.user

  await Article.find().sort({ createdAt: "desc" })
    .then((articles) => {
      if (user != null)
        res.render("articles/index", { articles: articles, user: user.username, user_id: user._id })
      else res.render("articles/index", { articles: articles, user: null, user_id: null })
    })
    .catch((e) => console.error(e))
})

router.get("/register", checkNotLoggedIn, (req, res) => {
  res.render("register", {msg_error: null})
})

router.get("/login", checkNotLoggedIn, (req, res) => {
  res.render("login")
})

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body
  
  if (username.length < 8)
    return res.render("register", { msg_error: "Username must be minimum 8 characters" })

  // User.findOne({email : email}).exec((err,user)=>{
  //       console.log(user);   
  //       if(user) {
  //           errors.push({msg: 'email already registered'});
  //           res.render('register',{errors,name,email,password,password2})  
  //          }

  try {
    // const hashedPassword = await bcrypt.hash(password, 10)
    // let user = new User()
    // user.username = username
    // user.email = email
    // user.password = hashedPassword
    // user.save()

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
