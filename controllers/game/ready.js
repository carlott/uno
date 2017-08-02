const update = require('../../models/update')
const access = require('../../models/access')
const start = require('./start').start
const boardcastTo = require('../socket-server').boardcastTo

/* set the player ready to play and check if all players are ready */
const ready = (msg) => {
  var allReady = true
  return update.setReady(true, msg.game_id, msg.user_id)
  .then(() => {
    return access.thisGamePlayers(msg.game_id)
  })
  .then(result => {
    if (result.length > 1)
      result.forEach(element => {
        if (element.ready_play === false) {
          allReady = false;
        }
      })
    else allReady = false
    if (allReady) {
      return start(msg)
    } else {
      return  new Promise((resolve) => {resolve()})
    }
  })
}

module.exports = ready
