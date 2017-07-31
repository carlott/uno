const access = require('../../models/access')
const update = require('../../models/update')
const shuffle = require('./start').shuffle

const MAX_CARDS = 108

const pileDiscards = msg => {
  var newPileCards, newNextOrder

  return access.getNoHandCards(msg.game_id)
  .then(data => {
    newPileCards = toNewPile(msg, data)
    newNextOrder = MAX_CARDS - data.length
    console.log('not in hand cards length:', data.length, ' new next_order:', newNextOrder)
    return update.deleteNoHandCards(msg.game_id)
  })
  .then(() => {
    return Promise.all( [ update.newNextOrder(msg.game_id, newNextOrder)
             , update.newGameCards(newPileCards) ] )
  })
}

function toNewPile(msg, cards) {
  var array = []
  cards.forEach(card => {
    array.push(card.card_id)
  })
  shuffle(array)
  shuffle(array)
  var rs = rows(msg.game_id, array)
  return rs
}

function rows(gameId, array) {
  var values = [], i, j
  for(i = 0, j = MAX_CARDS - array.length ; i < array.length; i++, j++) {
    values.push({ game_id: gameId, card_id: array[i], user_id: null, pile_order: j })
  }
  return values
}

module.exports = pileDiscards