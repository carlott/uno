const access = require('../../models/access')

const emailAddress = (req, res) => {
  access.getEmailAddress(req.query.emailAddress).then(data => {
    if (data.length > 0) {
      res.status(200).send('TAKEN')
      console.log('TAKEN', data)
    } else {
      res.status(200).send('AVAILABLE')
      console.log('AVAILABLE', data)
    }
  }).catch(err => {
    console.log(err)
  })
}


module.exports = emailAddress