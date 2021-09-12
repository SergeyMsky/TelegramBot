module.exports = {
   progress(bot, condition, message, msgEdit, text, chatId, msgAnswer) {
      if (text.match(condition)) {
         bot.sendMessage(chatId, message, { parse_mode: 'Markdown' }).then((msgData) => {
            let count = 0
            const timerId = setInterval(() => {
               count += Math.floor(Math.random() * 10)

               if (count > 100) {
                  count = 100
                  clearInterval(timerId)
               }
               bot.editMessageText(`${message}${count}%`, {
                  parse_mode: 'Markdown',
                  chat_id: msgData.chat.id,
                  message_id: msgData.message_id,
               })
               if (count === 100) {
                  bot.editMessageText(msgEdit, {
                     chat_id: msgData.chat.id,
                     message_id: msgData.message_id,
                  })
                  setTimeout(() => {
                     return bot.sendMessage(chatId, msgAnswer)
                  }, 1000)
               }
            }, 200)
         })
      }
   },
   chatId(msg) {
      return msg.chat.id
   },
   text(msg) {
      return msg.text.toLowerCase()
   },
   data(msg) {
      return msg.data
   },
   random(arr) {
      return arr[Math.floor(Math.random() * arr.length)]
   },
   includes(arr, msg) {
      return arr.some((el) => msg.text.toLowerCase().includes(el))
   },
   compare(arr, item1, item2) {
      if (arr[item1].includes(item2)) return 'Я победил!'
      if (arr[item2].includes(item1)) return 'Вы победили!'
      return 'Ничья.'
   },
   randomHash(hash) {
      const arr = Object.keys(hash)
      return arr[Math.floor(Math.random() * arr.length)]
   },
}
