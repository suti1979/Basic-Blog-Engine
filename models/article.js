const mongoose = require("mongoose")
const marked = require("marked")
const slugify = require("slugify") //ID good looking from title

//DOM PURIFY for HTML but no malware JS :P escape all HTML chars
const createDomPurify = require("dompurify")
const { JSDOM } = require("jsdom")
const dompurify = createDomPurify(new JSDOM().window)

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  markdown: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  sanitizedHtml: {
    type: String,
    required: true,
  },
})

articleSchema.pre("validate", function (next) {
  if (this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true })
  }

  if (this.markdown) {
    this.sanitizedHtml = dompurify.sanitize(marked(this.markdown))
  }

  // this NEXT() os for this pre validation
  next()
})

module.exports = mongoose.model("Article", articleSchema)
//to use in server.js
