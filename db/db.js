const pgp = require( 'pg-promise' )({
});

// const db_conf = require('./conf');
// connection = "postgres://" + db_conf.user+":" + db_conf.password + "@"+db_conf.host+":"+db_conf.port+"/"+db_conf.db;
connection = process.env.DATABASE_URL

if (connection) console.log('connected to postgres')
else console.log('db connect failed')
const db=pgp(connection);

// pgp.defaults.ssl = true
// const db = pgp.connect(process.env.DATABASE_URL, function(err, client) {
//     if (err) throw err
//     console.log('Connected to postgres! Getting schemas...')
// })

const gameCardColumns = new pgp.helpers.ColumnSet(['game_id', 'card_id', 'user_id', 'pile_order']
    , {table: 'game_cards'})

module.exports={ db: db,
                 gameCardColumns: gameCardColumns }
