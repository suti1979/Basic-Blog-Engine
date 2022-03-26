function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect("/")
}

function checkNotLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return next()
  }
  res.redirect("/")
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/")
  }
  next()
}

module.exports = {
    checkAuthenticated,
    checkNotAuthenticated,
    checkNotLoggedIn
}
