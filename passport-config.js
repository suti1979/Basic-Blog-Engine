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
   
        if (user.password != password) {
          return done(null, false, { message: "Password incorrect" })
        }
        return done(null, user)
      })
    })
  )

  passport.serializeUser((user, done) => done(null, user._id))
  passport.deserializeUser((id, done) => done(null, User.findById(id)))

}


module.exports = inicializePassport
