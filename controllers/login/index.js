const access = require('../../models/access')
const bcrypt = require('bcrypt')
const userState = require('../user-state')

const login = (req, res) => {
  console.log('email: %s password: %s', req.body.email, req.body.password)
  access.login(req.body.email, req.body.password)
  .then(data => {
    if(data !== null) {
      console.log('data ', data)
      bcrypt.compare(req.body.password, data.password)
      .then(result => {
        if(result)
          req.session.regenerate(err => {
            req.session.userId = data.id
            req.session.userName = data.user_name
            req.session.userImage = data.image_url
            var user = userState(req)
            console.log('user state: ', user)
            res.json({success:true})
          })
        else res.json({success:false})
      })
    } else {
      res.json({success:false})
    } 
  })
  .catch(err => {
    console.log(err)
  })
}

module.exports = login