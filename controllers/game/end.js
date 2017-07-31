const update = require('../../models/update')

/* set all players back to game room*/
const end = (msg) => {
  var promises = [ update.endPlayers(msg.game_id)
                   , update.reSetGame(msg.game_id)
                   , update.deleteOldGameCards(msg.game_id) ]

  return Promise.all(promises)
}

module.exports = end
