const access = require('../../models/access')
const update = require('../../models/update')
const boardcastTo = require('../socket-server').boardcastTo

const createGame = (req, res) => {
  update.createGame()
  .then(result => {
    req.session.userGameId = result[0].id
    req.session.userSeat = 0
    return update.newPlayer(result[0].id, req.session.userId, 0)
  })
  .then(() => {
    return access.getNameImage(req.session.userId)
  })
  .then(data => {
    var addGame = Object.assign({createGame: true, game_id: req.session.userGameId}, data)
    res.json({success: true})
    boardcastTo('lobby-list', addGame)
  })
  .catch(err => {
    res.json({success: false})
    console.log(err)
  })
}

module.exports = createGame