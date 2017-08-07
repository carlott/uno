const logoutGame = (req, res) => {
  req.session.userGameId = null
  res.redirect('/lobby')
}

module.exports = logoutGame