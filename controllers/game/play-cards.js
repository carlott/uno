const access = require('../../models/access')
const update = require('../../models/update')
const sharedCode = require('../../models/shared-code')
const newPile = require('./pile-discards')
const win = require('./win')

var cards   // local global for local functions
access.cards().then(result => {
  cards = result
})
.catch( Error => {
  console.log(Error)
})

/*
 * deal with the card played by a player
 * msg: { word:<action>, game_state:integer, game_id:integer, user_id:integer }
 */
const playCards = (msg) => {
  var thisGame, thisGameCards, thisGamePlayers, promises, handCards, isWon, validPlay, newPileCard

  promises = sharedCode.gamePromises(msg)
  promises.push(update.noToDo(msg.game_id))
  return Promise.all(promises)
  .then(values => {
    thisGame = values[0]
    thisGameCards = values[1]
    thisGamePlayers = values[2]
    handCards = values[3]

    validPlay = sharedCode.validPlay(msg, thisGame, thisGamePlayers)
    isWon = handCards.length === 1 ? true : false
    newPileCard = needNewPile(msg, thisGame)
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
    // if (validPlay(msg, thisGame, thisGamePlayers)) {
    if (validPlay) {
      promises = dealCard(msg, thisGame, thisGameCards, thisGamePlayers, handCards, isWon)
    } else {
      promises = []
      console.log('not valid play')
    }
    return Promise.all(promises)
  })
  .then(() => {
    if (validPlay && isWon)
      return win(msg)
    else return []
  })
} // end of playCards

function dealCard(msg, thisGame, thisGameCards, thisGamePlayers, handCards, isWon) {
  var promises = []
  var thisCard, newSeatTurn, missedSeatTurn, addPenaltyOrder
  var penalty = !saidUno(msg, thisGamePlayers, handCards, promises) ? true : false 

  thisCard = (typeof msg.word === 'number') ? cards[msg.word].number_symbol : msg.word

  if (penalty) promises.push(update.dealtGameCards(msg.user_id, msg.game_id, thisGame[0].next_order, 2))
  newNextOrder = penalty ? thisGame[0].next_order + 2 : thisGame[0].next_order
  addPenaltyOrder = penalty ? 2 : 0

  if ( thisCard === 10 ) {
    // skip card (the player lost this turn)
    promises.push(update.playNumberCard(msg.game_id, msg.word))
    newSeatTurn = sharedCode.newSeatTurn(thisGame, 2)
    promises.push(update.updateGame(newSeatTurn, thisGame[0].direction, thisGame[0].next_order + addPenaltyOrder
                    , msg.word, ++thisGame[0].game_state, msg.game_id, null))
    // promises.push(update.noToDo(msg.game_id, msg.user_id))
  } else if ( thisCard === 11 ) {
    // reverse card (changes the play direction)
    promises.push(update.playNumberCard(msg.game_id, msg.word))
    var newDirection = -1 * thisGame[0].direction
    newSeatTurn = sharedCode.newSeatTurn(thisGame, -1)
    promises.push(update.updateGame(newSeatTurn, newDirection, thisGame[0].next_order + addPenaltyOrder
                     , msg.word, ++thisGame[0].game_state, msg.game_id, null))
    // promises.push(update.noToDo(msg.game_id, msg.user_id))
  } else if( thisCard < 10 ) {
    // number card
    promises.push(update.playNumberCard(msg.game_id, msg.word))
    newSeatTurn = sharedCode.newSeatTurn(thisGame, 1)
    promises.push(update.updateGame(newSeatTurn, thisGame[0].direction, thisGame[0].next_order + addPenaltyOrder
                     , msg.word, ++thisGame[0].game_state, msg.game_id, null))
    // promises.push(update.noToDo(msg.game_id, msg.user_id))
  } else if ( thisCard === 12 ) {
    // next seat draws 2 cards and misses a turn
    promises.push(update.playNumberCard(msg.game_id, msg.word))
    missedSeatTurn = sharedCode.newSeatTurn(thisGame, 1)
    thisGamePlayers.forEach(element => {
      if ( element.seat_number === missedSeatTurn ) {
        promises.push(update.dealtGameCards(element.user_id, msg.game_id, newNextOrder, 2))
        promises.push(update.say_uno(msg.game_id, element.user_id, false))
      }
    newSeatTurn = sharedCode.newSeatTurn(thisGame, 2)
    promises.push(update.updateGame(newSeatTurn, thisGame[0].direction, thisGame[0].next_order+2 + addPenaltyOrder
                , msg.word, ++thisGame[0].game_state, msg.game_id, null))    
    // promises.push(update.noToDo(msg.game_id, msg.user_id))
    })
  } else if ( thisCard === 13 ) {
    // wild card
    promises.push(update.playNumberCard(msg.game_id, msg.word))
    promises.push(update.updateGame(thisGame[0].seat_turn, thisGame[0].direction, thisGame[0].next_order + addPenaltyOrder
                     , msg.word, ++thisGame[0].game_state, msg.game_id, null))
    if (!isWon)
      promises.push(update.addToDo(msg.game_id, msg.user_id, 'select-suit'))
  } else if ( thisCard === 14 ) {
    // wild draw 4 card -- valid if no card in hand matches the color of the top discard (next seat draws 4 cards)
    var validWild4 = true
    handCards.forEach(element => {
      if (( cards[thisGame[0].top_discard].color === cards[element.card_id].color
           || thisGame[0].required_color === cards[element.card_id].color )
           && element.card_id < 100 )
        validWild4 = false
    })
    if (validWild4) {
      promises.push(update.playNumberCard(msg.game_id, msg.word))
      missedSeatTurn = sharedCode.newSeatTurn(thisGame, 1)
      thisGamePlayers.forEach(element => {
        if ( element.seat_number === missedSeatTurn ) {
          promises.push(update.dealtGameCards(element.user_id, msg.game_id, newNextOrder, 4))
          promises.push(update.say_uno(msg.game_id, element.user_id, false))
        }
      })
      promises.push(update.updateGame(thisGame[0].seat_turn, thisGame[0].direction, thisGame[0].next_order+4 + addPenaltyOrder
                       , msg.word, ++thisGame[0].game_state, msg.game_id, null))    
      if (!isWon)
        promises.push(update.addToDo(msg.game_id, msg.user_id, 'select-suit'))
    } else {
      console.log('invalid wild 4 play')
    }
  }

  if (penalty) promises.push(update.addToDo(msg.game_id, msg.user_id, 'penalty'))
  return promises
} // end of dealCard
 
function countNeeds(msg) {
  var num = 0
  if (typeof msg.word === 'number') {
    if(msg.word > 103) num = 4
    else if(cards[msg.word].number_symbol === 12) num = 2
    else if(cards[msg.word].number_symbol > 10) num = 1
  }
  return num
}

function needNewPile(msg, thisGame) {
  var nextOrder = thisGame[0].next_order
  var requiredCards = countNeeds(msg)
  return (nextOrder + requiredCards) >= 108
}

function saidUno(msg, thisGamePlayers, handCards, promises) {
  var claimedUno = false
  thisGamePlayers.forEach(element => {
    if (msg.user_id === element.user_id && element.say_uno === true)
      claimedUno = true
  })
  if (handCards.length > 2 && claimedUno) promises.push(update.say_uno(msg.game_id, msg.user_id, false))

  return claimedUno || handCards.length !== 2
}

module.exports = playCards
