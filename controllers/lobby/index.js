const userState = require('../user-state')

const lobby = (req, res) => {
  res.render('lobby', Object.assign({title: 'Lobby'}, userState(req)))
}

module.exports = lobby