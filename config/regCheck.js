const passwordValidator = require("password-validator")
const User = require("./../models/users")

async function regCheck(req, res, next) {
  const { username, email, password } = req.body

  let errors = []
  let schema = new passwordValidator()
    .is().min(8, "Password must be minimum 8 characters.")
    .is().max(32, "Password must be maximum 32 characters.")
    .has().not().spaces()
    .has().uppercase()
    .has().lowercase()
    .has().digits(1, "Password has to contain numeric value.")

  if (!schema.validate(password)) {
    const passErr = schema.validate(password, { details: true })
    passErr.forEach((e) => {
      errors.push({ msg_error: e.message })
    })
  }

  if (username.length < 6) errors.push({ msg_error: "Username must be minimum 6 characters" })

  let checkEmail = await User.findOne({ email: email })
  if (checkEmail) {
    errors.push({ msg_error: "This email is already registered." })
  }

  let checkName = await User.findOne({ username: username })
  if (checkName) {
    errors.push({ msg_error: "This username is taken." })
  }

  //console.log(errors)
  if (errors.length > 0) {
    return res.render("register", { msg_errors: errors })
  }

  next()
}

module.exports = regCheck
