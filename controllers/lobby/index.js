const userState = require('../user-state')
const access = require('../../models/access')
const LOBBY_ID = -1

const lobby = (req, res) => {
  access.getGames()
  .then(data => {
    res.locals.games = JSON.stringify(data)
    return access.getMessages(LOBBY_ID)  // launch messages only the first page load
  })
  .then(data => {
    res.locals.userInfo = JSON.stringify(userState(req))
    res.locals.messages = JSON.stringify(data)
    res.locals.chatRoomId = JSON.stringify({id: 'Lobby'})
    res.render('lobby', Object.assign({title: 'Lobby'}, userState(req)))
  })
  .catch(err => {
    console.log(err)
  })
}

module.exports = lobby