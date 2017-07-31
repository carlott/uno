const access = require('../../models/access')
const update = require('../../models/update')

const DEALT_CARDS = 7
const NUM_OF_CARDS = 108

/* function starts the game when all players are ready */
const start = (msg) => {
  var array, game_players, game_cards, topOrder, rows

  return access.thisGamePlayers(msg.game_id)
  .then( data => {
    game_players = data
    topOrder = DEALT_CARDS * game_players.length
    array = oneArray(NUM_OF_CARDS)
    do {
      shuffle(array)
      shuffle(array)
    } while (array[topOrder] > 99)
    rows = gameCards(array, game_players)
    return update.deleteOldGameCards(msg.game_id)
  })
  .then( () => {
    return update.newGameCards(rows)
  })
  .then( () => {
    return access.getPileCardId(msg.game_id, topOrder)
  })
  .then( result => {
    msg.word = 'start'
    return update.startGame(++topOrder, result.card_id, msg.game_id)
  })
  .then( result => {
    return update.dealtGameCards(null, msg.game_id, --topOrder, 1)
  })
} // end of start

function gameCards(array, players) {
  var gameId = players[0].game_id
  var totalDealtCards = players.length * DEALT_CARDS
  var rows = [], i, j
  for (i=0, j=0; i < totalDealtCards; i++, j=(j+1)%players.length) {
    rows.push({ game_id: gameId, card_id: array[i], user_id: players[j].user_id, pile_order: null })
  }
  for(; i < NUM_OF_CARDS; i++) {
    rows.push({ game_id: gameId, card_id: array[i], user_id: null, pile_order: i })
  }
  return rows
}

function oneArray(NUM_OF_CARDS) {
  var i, arr = []
  for (i = 0; i < NUM_OF_CARDS; i++) {
    arr.push(i)
  }
  return arr
}

function shuffle(arr) {
  var i, j, k, temp
  for (i = arr.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1))
    temp = arr[i]
    arr[i] = arr[j]
    arr[j] = temp
  }
  return arr    
}  

module.exports = { start: start,
                   shuffle: (array) => shuffle(array) }
