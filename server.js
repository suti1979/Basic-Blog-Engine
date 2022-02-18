require("dotenv").config()
const DB_NAME = process.env.DB_NAME
const DB_PSW = process.env.DB_PSW
const HOST = "127.0.0.1"
const PORT = 7001

const express = require("express")
const app = express()
const mongoose = require("mongoose")

const mainRouter = require("./routes/router")
const articleRouter = require("./routes/articles")

const methodOverride = require("method-override") // for PUT, DELETE request
const passport = require("passport")
const flash = require("express-flash")
const session = require("express-session")

const URI = `mongodb+srv://${DB_NAME}:${DB_PSW}@cluster0.vpjd4.mongodb.net/blog?retryWrites=true&w=majority`

mongoose.set("useNewUrlParser", true)
mongoose.set("useFindAndModify", false)
mongoose.set("useCreateIndex", true)
mongoose.connect(URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const initializePassport = require("./config/passport-config")
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

app.use("/", mainRouter)

app.use("/articles", articleRouter) 

app.listen(PORT, HOST, () => console.log(`Server started @ ${HOST} port ${PORT}`))

/*
TODO:
refactor
new, edit, delete authenticate!
register check name, email ALREADY exist!
check psw length, name etc.
ask on delete
some style would be nice :P

*/
