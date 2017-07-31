/*
 * Filename: avatars_to_db.js 
 * The purpose of this file is to insert avatar images into database table if
 * any image were not yet in the table. So you could add images into the folder
 * at images/avatars and register them into the database by running:
 * 
 *   node avatars_to_db.js
 *   
 * It may take a half of minute waiting the server return the command prompt back
 * to you. This is not a erro but the pg-promise behavior.
 */

const fs = require('fs')
const db = require('./db').db

const avatarsPath = __dirname+'/../public/images/avatars'
const files = fs.readdirSync(avatarsPath)

db.any('SELECT * FROM Avatars')
.then(result => {
  if(result.length === 0) {
    files.forEach(f => {
      insertIt(f)
    })
  } else {
    files.forEach(f => {
      if(notInList(f, result)) insertIt(f)
    })
  }
})
.catch(err => {
  console.log(err)
})

function insertIt(f) {
  db.none('INSERT INTO Avatars (image_url) VALUES ($1)', f.toString())
  .then(() => {
    console.log(f + ' inserted')
  })
  .catch(error => {
    console.log(f + ' insert error')
  })
}

function notInList(f, result) {
  for(var i = 0; i < result.length; i++)
    if(f === result[i].image_url) return false
  return true
}

// files.forEach(function(f) {
//     db.any('SELECT * FROM Avatars WHERE image_url=$1', f.toString())
//         .then(function(data) {
//             // success;
//             if(data.toString() === '')
//                 db.none('INSERT INTO Avatars (image_url) VALUES ($1)',f.toString())
//                     .then(function() {
//                         console.log(f + ' inserted');
//                     })
//                     .catch(function(error) {
//                         console.log(f + ' insert error');
//                     });
//         })
//         .catch(function(error) {
//             // error;
//             console.log('Access db error');   
//         });
// });
