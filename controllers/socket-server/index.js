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
      io.emit(msg.toChatRoom, msg)
      chatLog(msg)
    })

    socket.on('game', function(msg) {
      console.log('server received ', msg)
      eventHandler(msg, function(toPlayer, toGroup) {
        socket.emit('game', toPlayer)
        broadcast(`g-${toGroup.group}`, toGroup)
        if (toGroup.order === 'start')
          notifyLobby(toGroup.group)
      })
    })
  })  // end of io.on

}

function broadcast (channel, msg) {
  io.emit(channel, msg)
}

function notifyLobby(gameId) {
  io.emit('lobby-list', { gameStarted: true, game_id: gameId })
}

module.exports = { server: socketServer,
                   broadcastTo: broadcast }
