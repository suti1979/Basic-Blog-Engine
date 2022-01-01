require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const Article = require("./models/article") //need to require every file in (if) use
const articleRouter = require("./routes/articles")

//!!!! methodOverride, to use PUT, DELETE request. APP.USE tu use app.use(methodOverride("_method"))
const methodOverride = require("method-override")

const app = express()

const db_name = process.env.DB_NAME
const db_psw = process.env.DB_PSW
const HOST = "127.0.0.1"
const PORT = 7001

const uri = `mongodb+srv://${db_name}:${db_psw}@cluster0.vpjd4.mongodb.net/blog?retryWrites=true&w=majority`

//for deprication errors
mongoose.set("useNewUrlParser", true)
mongoose.set("useFindAndModify", false)
mongoose.set("useCreateIndex", true)

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

app.set("view engine", "ejs")
app.use(express.urlencoded({ extended: false })) //for POST method to use form values in aricles ROUTER
//urlencoder needs to go before router! (articleRouter in this case)

app.use(methodOverride("_method")) //!!! up in the request

// for main page
app.get("/", async (req, res) => {
  const articles = await Article.find().sort({ createdAt: "desc" })
  res.render("articles/index", { articles: articles })
})

app.use("/articles", articleRouter) // in "articleRouter" every rout will be "/articles" + something

app.listen(PORT, HOST, () =>
  console.log(`Server started @ ${HOST} port ${PORT}`)
)
