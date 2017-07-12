const update = require('../../models/update')
const access = require('../../models/access')
const start = require('./start')
const boardcastTo = require('../socket-server').boardcastTo

/* set the player ready to play and check if all players are ready */
const ready = (msg) => {
  var allReady = true
  return update.setReady(true, msg.game_id, msg.user_id)
  .then(() => {
    return access.thisGamePlayers(msg.game_id)
  })
  .then(result => {
    result.forEach(element => {
      if (element.ready_play === false) {
      console.log(element.user_id + " IS NOT READY");
        allReady = false;
      }
    })
    if (allReady) {
      console.log('All ready, now start the game!')
      return start(msg)
    }
  //   } else {
  //     result = 'not ready to start'
  //   }
  //   toGroup.order = 'refresh'
  // }).catch(err => {
  //   console.log(err)
  // })  // .catch(e => {
  //   console.log(e)
  })
}

module.exports = ready
