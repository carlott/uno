const access = require('../../models/access')
const update = require('../../models/update')
const boardcastTo = require('../socket-server').boardcastTo

const joinGame = (req, res) => {
  const MAX_MEMBERS = 9
  const gameId = req.body.gameId
  var seatNumber
  access.getSeatCount(gameId)
  .then(data => {
    seatNumber = data.seat_count
    return update.newPlayer(gameId, req.session.userId, seatNumber)
  })
  .then(() => {
    req.session.userGameId = gameId
    req.session.userSeat = seatNumber
    return update.addOneSeat(gameId)
  })
  .then(() => {
    return access.getNameImage(req.session.userId)
  })
  .then(data => {
    res.json({success: true})
    var addUser = Object.assign({ game_id: gameId,
        joinable: seatNumber < MAX_MEMBERS-1 ? true : false }, data)
    console.log('add user ', addUser)
    boardcastTo('lobby-list', addUser)
    boardcastTo(`g-${gameId}`, {group: gameId, order: 'refresh'})
  })
  .catch(err => {
    if (err.code === '23505') {
      return access.thisPlayer(gameId, req.session.userId)
      .then(data => {
        console.log('player old seat number: ', data)
        req.session.userGameId = gameId
        req.session.userSeat = data[0].seat_number   // player was in the game, not new one
        res.json({success: true})
      })
      .catch(err => {
        res.json({success: false})
        console.log(err)
      })
    } else { 
      res.json({success: false})
      console.log(err)
    }
  })
}

module.exports = joinGame