require("dotenv").config()
const DB_NAME = process.env.DB_NAME
const DB_PSW = process.env.DB_PSW
const mongoose = require("mongoose")

function mongoConn() {
    const URI = `mongodb+srv://${DB_NAME}:${DB_PSW}@cluster0.vpjd4.mongodb.net/blog?retryWrites=true&w=majority`

    mongoose.set("useNewUrlParser", true)
    mongoose.set("useFindAndModify", false)
    mongoose.set("useCreateIndex", true)
    mongoose.connect(URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
}

module.exports = mongoConn 