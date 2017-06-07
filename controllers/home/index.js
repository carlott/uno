
const access = require('../../models/access.js')

const home = (req, res) => {
    access.avatars().then( data => {
      res.render('index', { title: 'Express', avatars: data });
    })
    .catch (Error => {
      console.log(Error)
    })
}

module.exports = home 
