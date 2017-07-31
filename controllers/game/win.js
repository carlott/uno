const access = require('../../models/access')
const update = require('../../models/update')

/* deal with user win this round */
const win = msg => {
  var thisGame, promises, handCards

  var promises = [ access.cards()
                   , access.cardsInPlayers(msg.game_id)
                   , access.thisPlayer(msg.game_id, msg.user_id)
                   , access.thisGame(msg.game_id)]

  return Promise.all(promises)
  .then(data => {
    var cards = data[0]
    var handCards = data[1]
    var thisPlayer = data[2]
    thisGame = data[3]
    var total = 0
    handCards.forEach(element => {
      total += cards[element.card_id].point
    })
    promises = [ update.addWonScore(msg.game_id, msg.user_id, total) ]
    promises.push(update.updateGame(thisPlayer[0].seat_number, 1
                    , thisGame[0].next_order, thisGame[0].top_discard, ++thisGame[0].game_state, msg.game_id, null))
    promises.push(update.reSetPlayers(msg.game_id))

    return Promise.all(promises)
  })
  .then(data => {
    console.log('total score data[0].score=', data[0].score)
    var action = data[0].score >= 500 ? 'end' : 'next-round'
    msg.word = 'win'
    return update.requiredAction(msg.game_id, msg.user_id, action, thisGame[0].next_order)
  })
}

module.exports = win