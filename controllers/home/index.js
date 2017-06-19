
const app = require('../../app.js')
const userState = require('../user-state')

const home = (req,res) => {
  if (req.session.isLogIn) {
    console.log('user logged in at home page. userId: %s userName: %s session id: %s', req.session.userId, req.session.userName, req.session.id)
  } else {
    console.log('user not logged in home page ', req.session.id)
  }
  res.render('index', Object.assign({ title: 'UNO' }, userState(req)))
}

module.exports = home 
