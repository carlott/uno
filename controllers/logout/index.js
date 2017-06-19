const logout = (req, res) => {
  // clean things
  req.session.regenerate(err => {
    if(err) res.status(200).send('ERROR')
    else {
      req.session.userId = null
      req.session.userName = null
      req.session.userImage = null
      res.redirect('/')
    }
  })
}

module.exports = logout