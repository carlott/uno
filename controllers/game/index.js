
const userState = require('../user-state')
const access = require('../../models/access')

const game = (req, res) => {
  if (userState(req).userGameId !== null) {
    return access.getMessages(userState(req).userGameId)  // launch messages only the first page load
    .then(data => {
      res.locals.userInfo = JSON.stringify(userState(req))
      res.locals.messages = JSON.stringify(data)
      res.locals.chatRoomId = JSON.stringify({id: `Game-${req.session.userGameId}`})
      res.render('game', Object.assign({title: 'Game'}, userState(req)))
    })
    .catch(err => {
      console.log(err)
    })
  } else {
    res.redirect('/')
  }
}

module.exports = game
