const access = require('../../models/access')
const update = require('../../models/update')
const boardcastTo = require('../socket-server').boardcastTo

const joinGame = (req, res) => {
  const gameId = req.body.gameId
  access.getSeatCount(gameId)
  .then(data => {
    return update.newPlayer(gameId, req.session.userId, data.seat_count)
  })
  .then(() => {
    req.session.userGameId = gameId
    return update.addOneSeat(gameId)
  })
  .then(() => {
    return access.getNameImage(req.session.userId)
  })
  .then(data => {
    res.json({success: true})
    var addUser = Object.assign({game_id: gameId}, data)
    console.log('add user ', addUser)
    boardcastTo('lobby-list', addUser)
  })
  .catch(err => {
    res.json({success: false})
    console.log(err)
  })
}

module.exports = joinGame