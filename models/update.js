const db = require('../db/db').db
const pgp = require('pg-promise')({})
const gameCardColumns = require('../db/db').gameCardColumns

const ADD_ONE_SEAT = `UPDATE Games
                      SET seat_count = seat_count + 1
                      WHERE id = $1`

const ADD_TO_DO = `UPDATE Players
                   SET to_do = concat(to_do, $3)
                   WHERE game_id = $1
                   AND user_id = $2`

const ADD_WON_SCORE = `UPDATE Players
                       SET score = score + $3
                       WHERE game_id = $1
                       AND user_id = $2
                       RETURNING score`

const CREATE_GAME = `INSERT INTO Games
                       (seat_count)
                     VALUES
                       (1)
                     RETURNING id`
                     
const DELETE_NO_HAND_CARDS = `DELETE FROM Game_Cards
                              WHERE game_id = $1
                              AND user_id IS null`

const DELETE_OLD_GAME_CARDS = `DELETE FROM Game_Cards
                               WHERE game_id = $1`

const DEALT_GAME_CARDS = `UPDATE Game_Cards
                          SET user_id = $1, pile_order = null
                          WHERE game_id = $2
                          AND pile_order >= $3
                          AND pile_order < ($3 + $4)`

const END_PLAYERS = `UPDATE Players
                     SET (ready_play, to_do, drawn_card, say_uno, score) =
                       (false, null, null, false, 0)
                     WHERE game_id = $1`

const NEW_MESSAGE = `INSERT INTO Messages
                       (game_id, user_name, image_full_url, post_time, message)
                     VALUES
                       ($1,$2,$3,$4,$5)`

const NEW_NEXT_ORDER = `UPDATE Games
                        SET next_order = $2
                        WHERE id = $1`

const NEW_PLAYER = `INSERT INTO Players
                      (game_id, user_id, seat_number)
                    VALUES
                      ($1,$2,$3)`

const NEW_USER = `INSERT INTO Users
                   (avatar_id, password, email, user_name)
                  VALUES
                   ($1,$2,$3,$4)`

const NO_TO_DO = `UPDATE Players
                  SET to_do = null, drawn_card = null
                  WHERE game_id = $1`

const PLAY_NUMBER_CARD = `UPDATE Game_Cards
                            SET user_id = null
                            WHERE game_id = $1
                            AND card_id = $2`

const REQUIRED_ACTION = `UPDATE Players
                         SET (to_do, drawn_card) = 
                           ($3, (SELECT card_id
                            FROM Game_Cards
                            WHERE game_id = $1
                            AND pile_order = $4))
                         WHERE game_id = $1
                         AND user_id = $2`

const RESET_GAME = `UPDATE Games
                    SET (direction, next_order, top_discard, required_color, joinable, game_state)
                      = (1, null, null, null, true, 0)
                    WHERE id = $1`

const RESET_PLAYERS = `UPDATE Players
                       SET (to_do, drawn_card, say_uno) =
                         (null, null, false)
                       WHERE game_id = $1`

const SAY_UNO = `UPDATE Players
                 SET say_uno = $3
                 WHERE game_id = $1
                 AND user_id = $2`

const SET_PILE_ORDER_NULL = `UPDATE Game_Cards
                             SET pile_order = null
                             WHERE game_id = $1
                             AND pile_order = $2`

const SET_READY = `UPDATE Players
                   SET ready_play = $1
                   WHERE game_id = $2
                   AND user_id = $3`

const START_GAME = `UPDATE Games
                    SET next_order = $1,
                        top_discard = $2,
                        direction = 1,
                        game_state = 1,
                        joinable = false
                    WHERE id = $3`

const UPDATE_GAME = `UPDATE Games
                     SET seat_turn = $1,
                         direction = $2,
                         next_order = $3,
                         top_discard = $4,
                         game_state = $5,
                         required_color = $7,
                         time_stamp = now()
                     WHERE id = $6`

const UPDATE_PLAYERS = `UPDATE Players
                        SET say_uno = $1,
                            announce_suit = $2,
                            score = $3
                        WHERE game_id = $4
                        AND user_id = $5`                                                                                                                                                          

module.exports = {
  addOneSeat: (game_id) => db.none(ADD_ONE_SEAT, game_id),

  addToDo: (game_id, user_id, to_do) => db.none(ADD_TO_DO, [game_id, user_id, to_do]),

  addWonScore: (game_id, user_id, won) => db.one(ADD_WON_SCORE, [game_id, user_id, won]),

  dealtGameCards: (user_id, game_id, pile_order, quantity) => db.none(DEALT_GAME_CARDS
                   , [user_id, game_id, pile_order, quantity]),

  deleteNoHandCards: (game_id) => db.none(DELETE_NO_HAND_CARDS, game_id),

  deleteOldGameCards: (game_id) => db.none(DELETE_OLD_GAME_CARDS, game_id),

  createGame: () => db.any(CREATE_GAME),

  endPlayers: (game_id) => db.none(END_PLAYERS, game_id),

  newGameCards: (values) => db.none(pgp.helpers.insert(values, gameCardColumns)),

  newMessage: (game_id, user_name, image_full_url, post_time, message) => db.none(NEW_MESSAGE
               , [game_id, user_name, image_full_url, post_time, message]),

  newNextOrder: (game_id, next_order) => db.none(NEW_NEXT_ORDER, [game_id, next_order]),

  newPlayer: (game_id, user_id, seat_number) => db.none(NEW_PLAYER, [game_id, user_id, seat_number]),

  newUser: (avatar_id, password, email, user_name) => db.none(NEW_USER, [avatar_id, password, email, user_name]),

  noToDo: (game_id) => db.none(NO_TO_DO, game_id),

  playNumberCard: (game_id, card_id) => db.none(PLAY_NUMBER_CARD, [game_id, card_id]),

  requiredAction: (game_id, user_id, to_do, next_order) => db.none(REQUIRED_ACTION, [game_id, user_id, to_do, next_order]),

  reSetGame: (game_id) => db.none(RESET_GAME, game_id),

  reSetPlayers: (game_id) => db.none(RESET_PLAYERS, game_id),
  
  say_uno: (game_id, user_id, trueOrFalse) => db.none(SAY_UNO, [game_id, user_id, trueOrFalse]),

  setPileOrderNull: (game_id, pile_order) => db.none(SET_PILE_ORDER_NULL, [game_id, pile_order]),

  setReady: (ready, game_id, user_id) => db.none(SET_READY, [ready, game_id, user_id]),

  startGame: (next_order, top_discard, id) => db.none(START_GAME, [next_order, top_discard, id]),

  updateGame: (seat_turn, direction, next_order, top_discard, game_state, id, color) => db.none(UPDATE_GAME
               , [seat_turn, direction, next_order, top_discard, game_state, id, color]),

  updatePlayers: (say_uno, announce_suit, score, game_id, user_id) => db.none(UPDATE_PLAYERS
                  , [say_uno, announce_suit, score, game_id, user_id])                                    
}
