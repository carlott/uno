const db = require('../db/db')

const ADD_ONE_SEAT = `UPDATE Games
                      SET seat_count = seat_count + 1
                      WHERE id = $1`

const ADD_PILE_ORDER = `UPDATE Game_Cards
                        SET pile_order = null
                        WHERE game_id = $1
                        AND pile_order = $2`

const CREATE_GAME = `INSERT INTO Games
                       (seat_count)
                     VALUES
                       (1)
                     RETURNING id`                        

const DELETE_OLD_GAME_CARDS = `DELETE FROM Game_Cards
                               WHERE game_id = $1`

const DEALT_GAME_CARDS = `UPDATE Game_Cards
                          SET user_id = $1, pile_order = null
                          WHERE game_id = $2
                          AND pile_order = $3`

const NEW_GAME_CARDS =  `INSERT INTO Game_Cards
                          (game_id, card_id, user_id, pile_order)
                        VALUES
                          ($1,$2,$3,$4)`
                        
const NEW_MESSAGE = `INSERT INTO Messages
                       (game_id, user_name, image_full_url, post_time, message)
                     VALUES
                       ($1,$2,$3,$4,$5)`

const NEW_PLAYER = `INSERT INTO Players
                      (game_id, user_id, seat_number)
                    VALUES
                      ($1,$2,$3)`

const NEW_USER = `INSERT INTO Users
                   (avatar_id, password, email, user_name)
                  VALUES
                   ($1,$2,$3,$4)`

const PLAY_NUMBER_CARD = `UPDATE Game_Cards
                            SET user_id = null
                            WHERE game_id = $1
                            AND card_id = $2`

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
                         game_state = $5
                     WHERE id = $6`

const UPDATE_PLAYERS = `UPDATE Players
                        SET say_uno = $1,
                            announce_suit = $2,
                            score = $3
                        WHERE game_id = $4
                        AND user_id = $5`                                                                                                                                                          

module.exports = {
  addOneSeat: (game_id) => db.none(ADD_ONE_SEAT, game_id),

  addPileOrder: (game_id, pile_order) => db.none(ADD_PILE_ORDER, [game_id, pile_order]),

  dealtGameCards: (user_id, game_id, pile_order) => db.none(DEALT_GAME_CARDS
                   , [user_id, game_id, pile_order]),

  deleteOldGameCards: (game_id) => db.none(DELETE_OLD_GAME_CARDS, game_id),

  createGame: () => db.any(CREATE_GAME),

  newGameCards: (game_id, card_id, user_id, pile_order) => db.none(NEW_GAME_CARDS
                 , [game_id, card_id, user_id, pile_order]),

  newMessage: (game_id, user_name, image_full_url, post_time, message) => db.none(NEW_MESSAGE
               , [game_id, user_name, image_full_url, post_time, message]),

  newPlayer: (game_id, user_id, seat_number) => db.none(NEW_PLAYER, [game_id, user_id, seat_number]),

  newUser: (avatar_id, password, email, user_name) => db.none(NEW_USER, [avatar_id, password, email, user_name]),

  playNumberCard: (game_id, card_id) => db.none(PLAY_NUMBER_CARD, [game_id, card_id]),

  setPileOrderNull: (game_id, pile_order) => db.none(SET_PILE_ORDER_NULL, [game_id, pile_order]),

  setReady: (ready, game_id, user_id) => db.none(SET_READY, [ready, game_id, user_id]),

  startGame: (next_order, top_discard, id) => db.none(START_GAME, [next_order, top_discard, id]),

  updateGame: (seat_turn, direction, next_order, top_discard, game_state, id) => db.none(UPDATE_GAME
               , [seat_turn, direction, next_order, top_discard, game_state, id]),

  updatePlayers: (say_uno, announce_suit, score, game_id, user_id) => db.none(UPDATE_PLAYERS
                  , [say_uno, announce_suit, score, game_id, user_id])                                    
}
