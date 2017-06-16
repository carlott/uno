var express = require('express');
var router = express.Router();

const createGame = require('../controllers/create-game')
const guest = require('../controllers/guest')
const home = require('../controllers/home')
const joinGame = require('../controllers/join-game')
const login = require('../controllers/login')
const signup = require('../controllers/signup')
const emailAddress = require('../controllers/signup/email-address')

/* GET home page. */
router.get('/', home)

/* GET about page. */
router.get('/about', (req, res) => {
  res.render('about')
})

/* POST create-game */
router.post('/create-game', createGame)

/* GET game page. */
 router.get('/game', (req, res) => {
   res.render('game')
})

/* POST guest */
router.post('/guest', guest)

/* POST join game */
router.post('/join-game', joinGame)

/* GET lobby page. */
router.get('/lobby', (req, res) => {
  res.render('lobby')
})

/* POST log in */
router.post('/login', login)

/* POST sign up page. */
router.post('/signup', signup)

/* GET user email address to check if it is available for a new user */
router.get('/signup/email-address', emailAddress)

module.exports = router;
