const guest = (req, res) => {
  console.log('id: %j name: %j', req.body.avatarId, req.body.userName)
  res.status(200).send('NOT IMPLEMENTED: Guest POST id: ' + req.body.avatarId
      + 'user name: ' + req.body.userName)
}

module.exports = guest
