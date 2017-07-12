const userState = (req) => {
  var id = typeof req.session.userId !== 'undefined' ? req.session.userId : null
  var user = typeof req.session.userName !== 'undefined' ? req.session.userName : null
  var image = typeof req.session.userImage !== 'undefined' ? req.session.userImage: null
  var game = typeof req.session.userGameId !== 'undefined' ? req.session.userGameId: null
  var seat = typeof req.session.userSeat !== 'undefined' ? req.session.userSeat : null
  return {userId: id, userName: user, userImage: image, userGameId: game, userSeat: seat}
}
module.exports = userState