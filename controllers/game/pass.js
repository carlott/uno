const sharedCode = require('../../models/shared-code')
const update = require('../../models/update')

/* deal with user click pass a play */
const pass = msg => {
  var thisGame, thisGameCards, thisGamePlayers, promises, handCards 

  promises = sharedCode.gamePromises(msg)
  promises.push(update.noToDo(msg.game_id))
  return Promise.all(promises)
  .then(values => {
    thisGame = values[0]
    thisGameCards = values[1]
    thisGamePlayers = values[2]
    handCards = values[3]

    // if (validPlay(msg, thisGame, thisGamePlayers)) {
    if (sharedCode.validPlay(msg, thisGame, thisGamePlayers)) {
      newSeatTurn = sharedCode.newSeatTurn(thisGame, 1)
      promises.push(update.updateGame(newSeatTurn, thisGame[0].direction
                      , thisGame[0].next_order, thisGame[0].top_discard, ++thisGame[0].game_state, msg.game_id, thisGame[0].required_color))
      promises.push(update.say_uno(msg.game_id, msg.user_id, false))
    } else {
      promises = []
      console.log('not valid play')
    }
    return Promise.all(promises)
  })
}

module.exports = pass
