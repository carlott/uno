var express = require('express');
var router = express.Router();

const game = require('../controllers/game').game
const guest = require('../controllers/guest')
const home = require('../controllers/home')
const lobby = require('../controllers/lobby')
const login = require('../controllers/login')
const signup = require('../controllers/signup')

/* GET home page. */
router.get('/', home)

/* POST game page. */
router.post('/game', game)

/* POST lobby page. */
router.post('/lobby', lobby)

/* GET log in page. */
router.get('/login', login)

/* GET sign up page. */
router.get('/signup', signup)

module.exports = router;
