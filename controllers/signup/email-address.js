const access = require('../../models/access')

const emailAddress = (req, res) => {
  access.existEmailId(req.query.emailAddress).then(data => {
    if (data !== null) {
      res.status(200).send('TAKEN')
    } else {
      res.status(200).send('AVAILABLE')
    }
  }).catch(err => {
    console.log(err)
  })
}


module.exports = emailAddress