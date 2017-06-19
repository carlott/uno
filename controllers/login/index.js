const access = require('../../models/access')
const userState = require('../user-state')

const login = (req, res) => {
  console.log('email: %s password: %s', req.body.email, req.body.password)
  access.login(req.body.email, req.body.password)
  .then(data => {
    if(data !== null) {
      console.log('data ', data)
      req.session.regenerate(err => {
        req.session.userId = data.id
        req.session.userName = data.nick_name
        req.session.userImage = data.image_url
        var user = userState(req)
        console.log('user state: ', user)
        res.status(200).send("VALID")
      })
    } else {
      res.status(200).send("INVALID")
    } 
  })
  .catch(err => {
    console.log(err)
  })
}

module.exports = login