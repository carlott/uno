const signup = (req, res) => {
  console.log('request: %j %j %j %j %j', req.body.avatarId, req.body.email, req.body.userName, req.body.password, req.body.confirmPassword)
  res.status(200).send({ warning: 'test sign up warning' }+req.body.avatarId)
}


module.exports = signup