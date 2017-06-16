const access = require('../../models/access')

const login = (req, res) => {
  console.log('email: ', req.body.email)
  access.getEmailAddress(req.body.email).then(data => {
    if(data.length > 0 && data[0].encrypted_password === req.body.password) {
      res.status(200).send("VALID")
      console.log('VALID ', data)
    } else {
      res.status(200).send("INVALID")
      Console.log('INVALID ', data)
    }
  }).catch(err => {
    console.log(err)
  })
}

module.exports = login