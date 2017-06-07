const socketIo = require('socket.io')
const eventHandler = require('../game').eventHandler

const socketServer = (app, server) => {
  const io = socketIo(server)

  app.set('io', io)

  io.on('connection', socket => {
      console.log('game client connected')

      socket.on('disconnect', data => {
          console.log('game client disconnected')
      })

      socket.on('chat message', function(msg) {
        socket.emit('chat message', msg)
      })

      socket.on('game', function(msg) {
console.log('server received ', JSON.stringify(msg))
        eventHandler(msg, function(toPlayer, toGroup) {
          socket.emit('game', toPlayer)
          io.emit('game', toGroup)
        })
      })
  })  // end of io.on

}

module.exports = socketServer
