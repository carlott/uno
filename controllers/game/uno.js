const sharedCode = require('../../models/shared-code')
const update = require('../../models/update')

/* deal with user click pass a play */
const uno = msg => {
  var thisGame, thisGameCards, thisGamePlayers, promises, handCards 

  promises = sharedCode.gamePromises(msg)
  return Promise.all(promises)
  .then(values => {
    thisGame = values[0]
    thisGameCards = values[1]
    thisGamePlayers = values[2]
    handCards = values[3]

    var validPlay = sharedCode.validPlay(msg, thisGame, thisGamePlayers)
    if (validPlay && handCards.length === 2) {
      promises.push(update.say_uno(msg.game_id, msg.user_id, true))
      promises.push(update.updateGame(thisGame[0].seat_turn, thisGame[0].direction
                      , thisGame[0].next_order, thisGame[0].top_discard, ++thisGame[0].game_state, msg.game_id, thisGame[0].required_color))
      promises.push(update.noToDo(msg.game_id, msg.user_id))
    } else {
      promises = []
    }
    return Promise.all(promises)
  })
}

module.exports = uno
