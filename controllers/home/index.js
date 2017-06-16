
// const access = require('../../models/access.js')

// const home = (req, res) => {
//     access.avatars().then( data => {
//       res.render('index', { title: 'UNO home', avatars: data });
//     })
//     .catch (Error => {
//       console.log(Error)
//     })
// }

// module.exports = home 

const app = require('../../app.js')

const home = (req,res) => {
  res.render('index', { title: 'UNO'}) //, avatars: req.app.locals.avatars})
}

module.exports = home 
