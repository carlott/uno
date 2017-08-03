const db = require('../db/db').db

const AVATARS = `SELECT * FROM Avatars
                 ORDER BY id`

const CARDS = `SELECT * FROM Cards ORDER BY id`

const CARD_IDS = `SELECT id FROM Cards`

const CARDS_IN_HAND = `SELECT card_id
                       FROM Game_Cards
                       WHERE game_id = $1
                       AND user_id = $2
                       ORDER BY card_id`

const CARDS_IN_PLAYERS = `SELECT user_id, card_id
                          FROM Game_Cards
                          WHERE game_id = $1
                          AND user_id IS NOT NULL
                          ORDER BY user_id, card_id`

const EXIST_EMAIL_ID =  `SELECT id, email
                          FROM Users
                          WHERE email = $1`

const GET_GAME_TIMESTAMPS = `SELECT id, time_stamp
                             FROM Games`

const GET_GAMES = `SELECT P.game_id, A.image_url, U.user_name, G.joinable
                   FROM Avatars A, Games G, Players P, Users U
                   WHERE A.id = U.avatar_id
                   AND U.id = P.user_id
                   AND P.game_id = G.id
                   ORDER BY P.game_id`

const GET_MESSAGES = `SELECT *
                      FROM Messages
                      WHERE game_id = $1
                      ORDER BY post_time`

const GET_NAME_IMAGE = `SELECT A.image_url, U.user_name
                        FROM Users U, Avatars A
                        WHERE U.avatar_id = A.id
                        AND U.id = $1`                         

const GET_NO_HAND_CARDS = `SELECT card_id
                            FROM Game_Cards
                            WHERE game_id = $1
                            AND user_id IS null`

const GET_PILE_CARDID = `SELECT card_id
                         FROM Game_Cards
                         WHERE game_id = $1
                         AND pile_order = $2`

const GET_SEAT_COUNT = `SELECT seat_count
                        FROM Games
                        WHERE id = $1`

const GET_TOP_CARDID = `SELECT GC.card_id
                        FROM Game_Cards GC, Games G
                        WHERE GC.game_id = $1
                        AND GC.game_id = G.id
                        AND GC.pile_order = G.next_order`

const LOGIN = `SELECT Users.id, Users.password, Users.user_name, Avatars.image_url
               FROM Users, Avatars
               WHERE Users.avatar_id = Avatars.id
               AND email = $1`

const GAME_CARDS = `SELECT * FROM Game_Cards
                    WHERE game_id = $1` 

const PLAYERS_THIS_GROUP = `SELECT P.user_id, U.user_name, U.user_score, P.game_id, P.ready_play
                              , P.to_do, P.drawn_card, P.seat_number, P.say_uno, P.score, A.image_url
                            FROM Players AS P, Users AS U, Games AS G, Avatars AS A
                            WHERE P.user_id = U.id
                            AND U.avatar_id = A.id
                            AND P.game_id = G.id
                            AND G.id = $1
                            ORDER BY P.seat_number`

const THISGAME_PLAYERS = `SELECT *
                          FROM Players
                          WHERE game_id = $1
                          ORDER BY seat_number`

const THIS_PLAYER = `SELECT * FROM Players
                     WHERE game_id = $1
                     AND user_id = $2`

const THIS_GAME = `SELECT * FROM Games
                   WHERE id = $1`



module.exports = {
  // for server init
  avatars: () => db.any(AVATARS),
  cards: () => db.any(CARDS),
  cardIds: () => db.any(CARD_IDS),

  existEmailId: (email) => db.oneOrNone(EXIST_EMAIL_ID, email),
  gameCards: (game_id) => db.any(GAME_CARDS, game_id),
  getPileCardId: (game_id, pile_order) => db.oneOrNone(GET_PILE_CARDID, [game_id, pile_order]),
  getTopCardId: (game_id) => db.one(GET_TOP_CARDID, game_id),
  thisGamePlayers: (game_id) => db.any(THISGAME_PLAYERS, game_id),
  thisPlayer: (game_id, user_id) => db.any(THIS_PLAYER, [game_id, user_id]),
  thisGame: (game_id) => db.any(THIS_GAME, game_id),

  // for send to client(s)
  cardsInHand: (game_id, user_id) => db.any(CARDS_IN_HAND, [game_id, user_id]),
  cardsInPlayers: (game_id) => db.any(CARDS_IN_PLAYERS, game_id),
  getNoHandCards: (game_id) => db.any(GET_NO_HAND_CARDS, game_id),
  getGames: () => db.any(GET_GAMES),
  getGameTimestamps: () => db.any(GET_GAME_TIMESTAMPS),
  getMessages: (game_id) => db.any(GET_MESSAGES, game_id),
  getNameImage: (user_id) => db.oneOrNone(GET_NAME_IMAGE, user_id),
  getSeatCount: (game_id) => db.oneOrNone(GET_SEAT_COUNT, game_id),
  login: (email) => db.oneOrNone(LOGIN, email),
  playersThisGroup: (game_id) => db.any(PLAYERS_THIS_GROUP, game_id),
}
