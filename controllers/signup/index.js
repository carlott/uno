const access = require('../../models/access')
const update = require('../../models/update')
const bcrypt = require('bcrypt')
const saltRounds = 9

const signup = (req, res) => {
  // check if email address had already taken
  access.existEmailId(req.body.email)
  .then(result => {
    if (result === null && req.body.password === req.body.confirmPassword) {
      // register user here
      bcrypt.hash(req.body.password, saltRounds)
      .then(hash => {
        console.log('hash result: ', hash)
        return update.newUser(req.body.avatarId, hash, req.body.email, req.body.userName)
      })
      .then(() => {
        return access.login(req.body.email, req.body.password)
      })
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
                res.json({success: true})
              })
            else res.json({success: false})
          })
        } else {
          res.json({success: false})
        } 
      })
      .catch (err => {
        console.log(err)
      })
    } else {
      // registeration failed
      res.json({success: false})
    }
      
  })
  .catch (err => {
    console.log(err)
  })
  console.log('request: %j %j %j %j %j', req.body.avatarId, req.body.email, req.body.userName, req.body.password, req.body.confirmPassword)
//  res.status(200).send({ warning: 'test sign up warning' }+req.body.avatarId)
}

module.exports = signup