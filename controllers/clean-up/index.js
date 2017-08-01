const access = require('../../models/access')
const update = require('../../models/update')
const broadcastTo = require('../socket-server').broadcastTo

const cleanUp = () => {
  cleanGames()
  cleanMessages()

  setInterval(() => {
    cleanGames()
  }, 3600*1000)

  setInterval(() => {
    cleanMessages()
  }, 24*3600*1000)
}

function cleanGames() {
  var gameIds = []
  var current = new Date()
  var lastActive, promises = []
  return access.getGameTimestamps()
  .then(timestamps => {
    timestamps.forEach(stamp => {
      lastActive = new Date(stamp.time_stamp)
      if (current - lastActive >= 3600000)
        gameIds.push(stamp.id)
    })
    if (gameIds.length > 0) {
      gameIds.forEach(id => {
        promises.push(update.deleteOldGameCards(id))
        promises.push(update.deleteGame(id))
        promises.push(update.deletePlayer(id))
      })
    }
    
    return Promise.all(promises)
  })
  .then(() => {
    broadcastTo('lobby-list', 'reload-page')
  })
  .catch(err => {
    console.log(err)
  })
}

function cleanMessages() {
  return  update.deleteMessages('5')  // delete messages that posted 5 days ago
  .catch(err => {
    console.log(err)
  })
}

module.exports = cleanUp