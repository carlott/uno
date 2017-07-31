const access = require('../../models/access.js')
const end = require('./end')
const ready = require('./ready')
const draw = require('./draw')
const pass = require('./pass')
const pickedColor = require('./picked-color')
const uno = require('./uno')
const userExit = require('./user-exit')
const playCards = require('./play-cards')
const newRound = require('./new-round')
const win = require('./win')

/*
 * Content of object from client:
 * msg: { word:<action>, game_id:integer, user_id:integer, game_state:integer }
 */
// const TO_PLAYER = { user_id:{}, order:{}, handCards:{} }
// const TO_GROUP = { group:{}, order:{}, players:{}, game:{} }

const eventHandler = (msg, callback) => {
  var toGroup = new Object()
  var toPlayer = new Object()


  handleEvent(msg)
  .then(() => {
    // read data from the updated tables and assemble send out packages
    outPromises = [ access.cardsInHand(msg.game_id, msg.user_id)
                    , access.thisGame(msg.game_id)
                    , access.playersThisGroup(msg.game_id)]
    if (msg.word === 'win')
      outPromises.push(access.cardsInPlayers(msg.game_id))
    return Promise.all(outPromises)
  })
  .then(data => {
    toPlayer.handCards = data[0]
    toGroup.game = data[1]
    toGroup.players = data[2]
    toPlayer.game_state = toGroup.game[0].game_state
    packOutPackage(msg, toPlayer, toGroup)
    checkToDo(msg, toGroup, toPlayer)
    if (msg.word === 'win') {
      toGroup.winning = winInfo(msg, data[2], data[3])
    }
    callback(toPlayer, toGroup)
  })
  .catch(err => {
    console.log('eventHandler error: ', err)
  })
}

function handleEvent(msg) {
  const word = msg.word
  var result = 'empty'
  var promise

  if (typeof word === 'number') {
    result = 'get number'
    promise = playCards(msg)
    // promise = playCards(msg, toPlayer, toGroup)
  } else {
    switch (word) {
      case 'draw':
        result = 'get draw'
        promise = draw(msg)
        break
      case 'refresh':
        result = 'auto refresh'
        break
      case 'pass':
        result = 'get pass'
        promise = pass(msg)
        break
      case 'ready':
        result = 'get ready'
        promise = ready(msg)
        break
      case 'r':
      case 'g':
      case 'b':
      case 'y':
        result = 'get ' + word
        promise = pickedColor(msg)
        break
      case 'uno':
        result = 'get uno'
        promise = uno(msg)
        break
      case 'exit':
        result = 'get exit'
        exit(msg)
        break
      case 'next-round':
        result = 'got next-round'
        promise = newRound(msg)
        break
      case 'end':
        result = 'get end'
        promise = end(msg)
        break
      default:
        result = 'no matched word'
    }
  }

  return promise || new Promise((resolve) => {resolve()});
}

const orderToUser = word => {
  if (typeof word === 'number') word = 'refresh'
  switch (word) {
    case 'ready':
    case 'refresh':
    case 'end':
      result = 'redraw'
      break
    case 'draw':
      result = 'settle'
      break
    case 'exit':
      result = 'exit'
      break
    default:
      result = 'none'
  }
  return result
}

function orderToGroup(word) {
  var result
  switch (word) {
    case 'draw':
    case 'select-suit':
    case 'settle':
      result = 'none'
      break
    case 'uno':
      result = 'uno'
      break
    case 'refresh':
    case 'end':
      result = 'redraw'
      break
    case 'win':
      result = 'show-win'
      break
    case 'start':
      result = 'start'
      break
    default:
      result = 'refresh'
  }
  return result
}

function checkToDo(msg, group, player) {
  group.players.forEach(element => {
    if(element.user_id === msg.user_id && element.to_do !== null) {
      player.order = element.to_do
      if (msg.word === 'draw') player.new_card = element.drawn_card
    }
  })
}

function packOutPackage(msg, toPlayer, toGroup) {
  toPlayer.user_id = msg.user_id
  toPlayer.order = orderToUser(msg.word)
  toGroup.order = orderToGroup(msg.word)
  toGroup.group = msg.game_id
}

function winInfo(msg, players, playerHandCards) {
  console.log('now in winInfo()')
  var obj = { remain_cards: [] }
  players.forEach(player => {
    if (msg.user_id === player.user_id) {
      obj.winner_image = player.image_url
      obj.winner = player.user_name
      obj.total_score = player.score
    } else {
      obj.remain_cards.push( { avatar: player.image_url, user_id: player.user_id, user_name: player.user_name
                      , handCards: getCards(player.user_id, playerHandCards) } )
    }
  })
  return obj
}

function getCards(user_id, handCards) {
  var cards = []
  handCards.forEach(element => {
    if (element.user_id === user_id)
      cards.push(element.card_id)
  })
  return cards
}

module.exports = eventHandler
