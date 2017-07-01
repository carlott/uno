const socketIo = require('socket.io')
const chatLog = require('../chat-log')
const eventHandler = require('../game/event-handler')
var io

const socketServer = (app, server) => {
  io = socketIo(server)

  app.set('io', io)

  io.on('connection', socket => {
      console.log('a socket client connected')

      socket.on('disconnect', data => {
          console.log('a socket client disconnected')
      })

      socket.on('chat', function(msg) {
        console.log('server received ', msg)
        io.emit(msg.toChatRoom, msg)
        chatLog(msg)
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

function boardcastTo (channel, msg) {
//    io.on('connection', socket => {
    io.emit(channel, msg)
//    })
}



module.exports = { server: socketServer,
                   boardcastTo: boardcastTo }
