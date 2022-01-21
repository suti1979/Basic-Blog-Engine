require("dotenv").config()
const DB_NAME = process.env.DB_NAME
const DB_PSW = process.env.DB_PSW
const HOST = "127.0.0.1"
const PORT = 7001

const express = require("express")
const mongoose = require("mongoose")
const articleRouter = require("./routes/articles")
const methodOverride = require("method-override") // for PUT, DELETE request
const app = express()
const bcrypt = require("bcrypt")
const passport = require("passport")
const flash = require("express-flash")
const session = require("express-session")

const Article = require("./models/article")
const User = require("./models/users")
const URI = `mongodb+srv://${DB_NAME}:${DB_PSW}@cluster0.vpjd4.mongodb.net/blog?retryWrites=true&w=majority`

mongoose.set("useNewUrlParser", true)
mongoose.set("useFindAndModify", false)
mongoose.set("useCreateIndex", true)
mongoose.connect(URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const initializePassport = require("./passport-config")
initializePassport(passport)

app.set("view engine", "ejs")
app.use(express.urlencoded({ extended: false })) // urlencoder needs to go before router!
app.use(methodOverride("_method"))
app.use(flash())
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
)
app.use(passport.initialize())
app.use(passport.session())

app.get("/", checkAuthenticated, async (req, res, next) => {
  const articles = await Article.find().sort({ createdAt: "desc" })
  console.log(req.user)
  res.render("articles/index", { articles: articles, user: req.user })
})

app.get("/register", (req, res) => {
  res.render("register")
})

app.get("/login", (req, res) => {
  res.render("login")
})

app.post("/register", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    let user = new User()
    user.username = req.body.username
    user.email = req.body.email
    user.password = hashedPassword
    user = user.save()

    res.redirect("/login")
  } catch {
    res.redirect("/register")
  }
})

app.post(
  "/login",
  checkNotAuthenticated,
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
)

app.use("/articles", articleRouter) // in "articleRouter" every rout will be "/articles" + something

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect("/login")
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/")
  }
  next()
}

app.listen(PORT, HOST, () =>
  console.log(`Server started @ ${HOST} port ${PORT}`)
)
