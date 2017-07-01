var express = require('express');
var router = express.Router();

const createGame = require('../controllers/create-game')
const game = require('../controllers/game')
const guest = require('../controllers/guest')
const home = require('../controllers/home')
const joinGame = require('../controllers/join-game')
const lobby = require('../controllers/lobby')
const login = require('../controllers/login')
const logout = require('../controllers/logout')
const signup = require('../controllers/signup')
const emailAddress = require('../controllers/signup/email-address')
const userState = require('../controllers/user-state')

/* GET home page. */
router.get('/', home)

/* GET about page. */
router.get('/about', (req, res) => {
  res.render('about', Object.assign({title: 'About'}, userState(req)))
})

/* POST create-game */
router.post('/create-game', createGame)

/* GET game page. */
 router.get('/game', game)

/* POST guest */
router.post('/guest', guest)

/* POST join game */
router.post('/join-game', joinGame)

/* GET lobby page. */
router.get('/lobby', lobby)

/* POST log in */
router.post('/login', login)

/* GET log out */
router.get('/logout', logout)

/* POST sign up page. */
router.post('/signup', signup)

/* GET user email address to check if it is available for a new user */
router.get('/signup/email-address', emailAddress)

module.exports = router;
