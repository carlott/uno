const update = require('../../models/update')
const access = require('../../models/access')
const sharedCode = require('../../models/shared-code')

/* deal with a player pick a color */
const pickedColor = msg => {
  var thisGame, thisGamePlayers, promises 

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
      var newSeatTurn = sharedCode.newSeatTurn(thisGame, 1)
      promises.push(update.updateGame(newSeatTurn, thisGame[0].direction
                  , thisGame[0].next_order, thisGame[0].top_discard, ++thisGame[0].game_state
                  , msg.game_id, msg.word))
      // promises.push(update.noToDo(msg.game_id, msg.user_id))
    } else {
      promises = []
      console.log('not valid color pick')
    }

    return Promise.all(promises)
  })
}

module.exports = pickedColor
