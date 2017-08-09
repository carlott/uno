const access = require('../../models/access')
const update = require('../../models/update')
const bcrypt = require('bcrypt')
const saltRounds = 9

const signup = (req, res) => {
  // check if email address had already taken
  return access.existEmailId(req.body.email)
  .then(result => {
    if (result === null && req.body.password === req.body.confirmPassword) {
      // register user here
      bcrypt.hash(req.body.password, saltRounds)
      .then(hash => {
        replaceTags(req)
        return update.newUser(req.body.avatarId, hash, req.body.email, req.body.userName)
      })
      .then(() => {
        return access.login(req.body.email, req.body.password)
      })
      .then(data => {
        if(data !== null) {
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
}

function replaceTags(request) {
  request.body.userName = request.body.userName.replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

module.exports = signup