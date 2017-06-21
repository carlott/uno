const userState = (req) => {
  var id = typeof req.session.userId !== 'undefined' ? req.session.userId : null
  var user = typeof req.session.userName !== 'undefined' ? req.session.userName : null
  var image = typeof req.session.userImage !== 'undefined' ? req.session.userImage: null
  var game = typeof req.session.userGameId !== 'undefined' ? req.session.userGameId: null
  return { userId: id, userName: user, userImage: image, userGameId: game }
}

module.exports = userState