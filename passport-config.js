const LocalStrategy = require("passport-local").Strategy
const bcrypt = require("bcrypt")
const User = require("./models/users")

function inicializePassport(passport) {
  passport.use(
    new LocalStrategy((username, password, done) => {
      User.findOne({ username: username }, (err, user) => {
        if (err) {
          return done(err)
        }
        if (!user) {
          return done(null, false, { message: "No user with that name" })
        }

        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err

          if (isMatch) {
            return done(null, user)
          } else {
            return done(null, false, { message: "pass incorrect" })
          }
        })
      })
    })
  )

  passport.serializeUser((user, done) => done(null, user._id))
  passport.deserializeUser((id, done) => done(null, User.findById(id)))
}

module.exports = inicializePassport
