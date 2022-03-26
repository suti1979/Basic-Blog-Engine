require("dotenv").config()

const HOST = "127.0.0.1"
const PORT = process.env.PORT || 7001
const express = require("express")
const app = express()
const mongoConn = require("./config/mongoConn")

mongoConn()

const mainRouter = require("./routes/router")
const articleRouter = require("./routes/articles")
const methodOverride = require("method-override") 
const passport = require("passport")
const flash = require("express-flash")
const session = require("express-session")
const initializePassport = require("./config/passport-config")
const path = require("path")

initializePassport(passport)

app.use(express.static(path.join(__dirname, "public")))
app.set("view engine", "ejs")
app.use(express.urlencoded({ extended: false })) 
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
app.use("/", mainRouter)
app.use("/articles", articleRouter) 
app.listen(PORT, HOST, () => 
  console.log(`Server started @ http://${HOST}:${PORT}`))
