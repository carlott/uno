const access = require('./access')
const update = require('./update')

var cards   // local global for local functions
access.cards().then(result => {
  cards = result
})
.catch( Error => {
  console.log(Error)
})

const gameInfoPromises = msg => {
  return [ access.thisGame(msg.game_id)
          , access.gameCards(msg.game_id)
          , access.thisGamePlayers(msg.game_id)
          , access.cardsInHand(msg.game_id, msg.user_id) ]
}

const getNewSeatTurn = (thisGame, step) => {
  return (thisGame[0].seat_turn + step*thisGame[0].direction + thisGame[0].seat_count) % thisGame[0].seat_count
}

const checkValidPlay = (msg, thisGame, thisGamePlayers) => {
  const ACCEPT_ACTION = ['draw','pass','uno']
  var inTurn, colorMatch, validDraw

  // check if the top discard is action card
  var wildCard = cards[thisGame[0].top_discard].number_symbol === 13 ? true : false
  var wildFour = cards[thisGame[0].top_discard].number_symbol === 14 ? true : false
  // check if in valid state
  var validState = (msg.game_state === thisGame[0].game_state) ? true : false
  // check if in turn
  thisGamePlayers.forEach(element => {
    if (msg.user_id === element.user_id) {
      inTurn = element.seat_number === thisGame[0].seat_turn ? true : false
      if (element.to_do === 'settle') {
        validDraw = msg.word !== 'draw' && (msg.word === 'pass' || element.drawn_card === msg.word) ? true : false
      } else {
        validDraw = true
      }
    }
  })
  // check top discard's color
  if ((wildCard || wildFour) && thisGame[0].required_color !== null 
       && typeof msg.word === 'number' && thisGame[0].required_color === cards[msg.word].color) 
    colorMatch = true
  else if ((wildCard || wildFour) && thisGame[0].required_color === null
        && ['r','y','g','b'].indexOf(msg.word) >= 0)
    colorMatch = true
  else if (typeof msg.word === 'number' && msg.word <= 99 && cards[thisGame[0].top_discard].color === cards[msg.word].color)
    colorMatch = true
  else if (typeof msg.word === 'number' && msg.word > 99)
    colorMatch = true
  else colorMatch = false
  // check top discard's number
  var numberMatch = typeof msg.word === 'number' && cards[thisGame[0].top_discard].number_symbol === cards[msg.word].number_symbol ? true : false     
  // check if an action
  var validAction = ACCEPT_ACTION.indexOf(msg.word) >= 0 ? true : false

  return inTurn && validState && validDraw && (colorMatch || numberMatch || validAction)
} // end of validPlay

module.exports = { gamePromises: gameInfoPromises,
                   validPlay: checkValidPlay,
                   newSeatTurn: getNewSeatTurn }