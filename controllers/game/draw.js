const access = require('../../models/access')
const update = require('../../models/update')
const newPile = require('./pile-discards')
const sharedCode = require('../../models/shared-code')

/* deal with user draw a card */
const draw = (msg) => {
  var thisGame, thisGameCards, thisGamePlayers, promises=[], handCards, newPileCard 

  promises = sharedCode.gamePromises(msg)
  promises.push(update.noToDo(msg.game_id))
  return Promise.all(promises)
  .then(values => {
    thisGame = values[0]
    thisGameCards = values[1]
    thisGamePlayers = values[2]
    handCards = values[3]

    newPileCard = thisGame[0].next_order >= 108 ? true : false
    if (newPileCard) {
      return newPile(msg)
    } else return []
  })
  .then(() => {
    if (newPileCard)
      promises = [ access.thisGame(msg.game_id)
        , access.gameCards(msg.game_id) ]
    else promises = []
    return Promise.all(promises)
  })
  .then(data => {
    if (newPileCard) {
      thisGame = data[0]
      thisGameCards = data[1]
    }
    if (sharedCode.validPlay(msg, thisGame, thisGamePlayers)) {
      promises.push(update.dealtGameCards(msg.user_id, msg.game_id, thisGame[0].next_order, 1))
      promises.push(update.updateGame(thisGame[0].seat_turn, thisGame[0].direction
                    , thisGame[0].next_order+1, thisGame[0].top_discard, thisGame[0].game_state+1, msg.game_id, thisGame[0].required_color))
    } else {
      promises = []
      console.log('not valid draw')
    }
    return Promise.all(promises)
  })
  .then(() => {
    return update.requiredAction(msg.game_id, msg.user_id, 'settle', thisGame[0].next_order)
  })
}

module.exports = draw
