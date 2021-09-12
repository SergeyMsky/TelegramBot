require('dotenv').config()
const TelegramBot = require('node-telegram-bot-api')
const bot = new TelegramBot(process.env.TOKEN, { polling: true })
const command = require('./commands')
const helper = require('./helper')
const keyboard = require('./keyboard')

bot.setMyCommands(command)

bot.onText(/\/start/, async (msg) => {
   const messageStart = `🙋‍♂️ <i>Добро пожаловать, человек ${msg.from.first_name}!</i>`

   return bot.sendMessage(helper.chatId(msg), messageStart, { parse_mode: 'HTML' })
})

bot.onText(/\/info/, async (msg) => {
   const messageInfo = '<b><i>👨🏻‍🏭 Вот что я умею:</i></b>\n\n👮🏻‍♂️ Взламываю пентагон, но это, если очень надо...\n🔮 Отвечаю на главный вопрос жизни, вселенной и всего такого...\n🎲 Помогаю с принятием решения, подкинув монетку!\n🤹🏻‍♂️ Можем сыграть в игру - камень, ножницы, бумага, ящерица, спок. Правила простые, я объясню! Жмите /cuefa.\n🎱 Могу ответить на вопрос, как волшебный шар 8, только задайте его, со знаком «?».'

   return bot.sendMessage(helper.chatId(msg), messageInfo, { parse_mode: 'HTML' })
})

bot.onText(/\/cuefa/, async (msg) => {
   const rulesCuefa = '<b>Правила игры:</b>\n\n<code>💁‍♂️ Всё довольно просто!</code>\n<i>Ножницы режут бумагу. Бумага заворачивает камень. Камень давит ящерицу, а ящерица травит Спока, в то время как Спок ломает ножницы, которые, в свою очередь, отрезают голову ящерице, которая ест бумагу, на которой улики против Спока. Спок испаряет камень, а камень, разумеется, затупляет ножницы.</i>'

   return bot.sendMessage(helper.chatId(msg), rulesCuefa, {
      parse_mode: 'HTML',
      reply_markup: {
         inline_keyboard: [keyboard.startCuefa],
      },
   })
})

bot.on('callback_query', async (query) => {
   const chatId = query.message.chat.id
   const messageId = query.message.message_id
   const data = query.data

   const cuefaHash = {
      stone: ['scissors', 'lizard'],
      scissors: ['paper', 'lizard'],
      paper: ['stone', 'spock'],
      lizard: ['paper', 'spock'],
      spock: ['stone', 'scissors'],
   }

   if (data === 'startCuefa') {
      await bot.editMessageText('🤹🏻‍♂️ Что выбираете?', {
         chat_id: chatId,
         message_id: messageId,
      })
      return bot.editMessageReplyMarkup(
         {
            inline_keyboard: [Object.keys(cuefaHash).map((item) => ({ text: item, callback_data: item }))],
         },
         {
            chat_id: chatId,
            message_id: messageId,
         }
      )
   } else {
      const botSelect = helper.randomHash(cuefaHash)
      const text = helper.compare(cuefaHash, botSelect, data)
      const msgText = `<i>Я выбрал</i> - <b>${botSelect}</b>\n<i>Ваш выбор</i> - <b>${data}</b>\n<code>${text}</code>\n\n👨‍💻 Сыграем еще раз?`

      await bot.editMessageText(msgText, {
         parse_mode: 'HTML',
         chat_id: chatId,
         message_id: messageId,
      })
      await bot.editMessageReplyMarkup(
         {
            inline_keyboard: [keyboard.startCuefa],
         },
         {
            chat_id: chatId,
            message_id: messageId,
         }
      )
   }
})

bot.on('message', async (msg) => {
   const options = ['/start', '/info', '/cuefa', 'умеешь', 'вопрос', 'спросить', '?', 'пентагон', 'жизн', 'монетк']
   const anything = [`${msg.from.first_name}, я вас не понимаю, может спросите что-нибудь ещё?`, `Я вас не понимаю, воспользуйтесь /info, что бы узнать, что я умею.`, `${msg.from.first_name}, я вас не понимаю, поробуйте ещё раз.`, `Я не знаю, что это значит.`]

   if (!helper.includes(options, msg)) {
      return bot.sendMessage(helper.chatId(msg), helper.random(anything))
   }
})

bot.on('message', async (msg) => {
   const text = msg.text.toLowerCase()
   const chatId = msg.chat.id

   const messageHack = `🔴 _Взлом пентагона в процессе..._`
   const messageHackEdit = `🟢 Пентагон успешно взломан!`

   const messageLife = `🕵🏻‍♂️ _Поиск ответа, на главный вопрос жизни, вселенной и всего такого..._`
   const messageLifeEdit = `☝️ Ответ найден.`
   const messageLifeAnswer = `👌 Я всё очень тщательно проверил. Ответ - сорок два.`

   helper.progress(bot, 'пентагон', messageHack, messageHackEdit, text, chatId)
   helper.progress(bot, 'жизн', messageLife, messageLifeEdit, text, chatId, messageLifeAnswer)
})

bot.on('message', async (msg) => {
   let coinArr = ['Орёл.', 'Выпал орёл.', 'Решка.', 'Выпала решка.', 'Ой, закатилась под кровать']
   let coinOut = coinArr.slice(0, 4)
   let coinFull = [].concat(...Array(4).fill(coinOut))
   coinArr.push(...coinFull)

   if (helper.text(msg).match('монетк')) {
      return bot.sendMessage(helper.chatId(msg), helper.random(coinArr))
   }
})

bot.on('message', async (msg) => {
   let magicArr = ['Бесспорно.', 'Предрешено.', 'Никаких сомнений.', 'Определённо да.', 'Можете быть уверенными в этом.', 'Мне кажется — «да».', 'Вероятнее всего.', 'Хорошие перспективы.', 'Знаки говорят — «да».', 'Да.', 'Пока не ясно, попробуйте снова.', 'Спросите позже.', 'Лучше не рассказывать.', 'Сейчас нельзя предсказать.', 'Сконцентрируйтесь и спросите опять.', 'Даже не думайте.', 'Мой ответ — «нет».', 'По моим данным — «нет».', 'Перспективы не очень хорошие.', 'Весьма сомнительно.']

   if (helper.text(msg).match('вопрос') || helper.text(msg).match('спросить')) {
      await bot.sendMessage(helper.chatId(msg), '🎱 Задайте ваш вопрос, обязательно со знаком «?».')
   } else if (helper.text(msg).match('\\?')) {
      return bot.sendMessage(helper.chatId(msg), helper.random(magicArr))
   }
})
