const update = require('../../models/update')

const chatLog = msg => {
  update.newMessage(msg.game_id, msg.user_name, msg.image_full_url
                    , msg.post_time, msg.message)
  .catch(err => {
    console.log(err)
  })
}

module.exports = chatLog