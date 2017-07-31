const update = require('../../models/update')
const access = require('../../models/access')
const start = require('./start').start

/* set the player ready to play and check if all players are ready */
const newRound = (msg) => {
  var promises
  return access.thisGame(msg.game_id)
  .then(data => {
    promises = [ update.updateGame(data[0].seat_turn, 1, null, null, 1, msg.game_id, null)
                  , update.noToDo(msg.game_id)
                  , start(msg)
    ]
    return Promise.all(promises)
  })
}

module.exports = newRound
