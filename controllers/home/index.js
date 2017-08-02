
const app = require('../../app.js')
const userState = require('../user-state')

const home = (req,res) => {
  res.render('index', Object.assign({ title: 'UNO' }, userState(req)))
}

module.exports = home 
