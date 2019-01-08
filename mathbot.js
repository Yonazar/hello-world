var mathId = require('./mathId');
var TelegramBot = require('node-telegram-bot-api');
var token_polytech = '645936739:AAGGlE7YDgguTykQUa2jRdIzuJ0lLWk88lE';
var bot = new TelegramBot(token_polytech, {polling: true});

var sendGuess = (fromId, msg, topic, number) => {
    let link = ` /${number}`
    bot.sendMessage(fromId, msg + topic + link);
}

bot.onText(/\/start/, function(msg) {
  var fromId = msg.chat.id;
  var mes = "Здорова, бандит! Я бот, который кидает тебе конспекты по матану. Напиши название или часть названия темы, а я кину варианты 😉";
  bot.sendMessage(fromId, mes);
})

bot.onText(/\/[0-76]/, function(msg) {
      var fromId = msg.chat.id;
      let str = msg.text.slice(1);
      var need = '';
      Object.keys(mathId).forEach(topic => { if (mathId[topic] == str) { need = topic; } })
      var doc = `math/${mathId[need]}.pdf`;
      bot.sendMessage(fromId, need);
      bot.sendDocument(fromId, doc);
      bot.sendSticker(fromId, 'stickers/sticker2.webp');
  });

bot.onText(/[а-я]{3,}/i, function(msg) {
  var fromId = msg.chat.id;
  let k=0;
  Object.keys(mathId).forEach(topic => {if (topic.toLowerCase().indexOf(msg.text.toLowerCase()) != -1) {
      if (topic.toLowerCase() == msg.text.toLowerCase()) {
            var doc = `math/${mathId[topic]}.pdf`;
            bot.sendDocument(fromId, doc);
            bot.sendSticker(fromId, 'stickers/sticker2.webp'); }
      else {
        switch(k) {
          case 0: { sendGuess(fromId, 'Вроде как, ты имел в виду ', topic, mathId[topic]); k++; break;}
          case 1: { sendGuess(fromId, 'А может эту - ', topic, mathId[topic]); k++; break;}
          case 2: { sendGuess(fromId, 'Я понял, наверно вот эта - ', topic, mathId[topic]); k++; break;}
          default: { sendGuess(fromId, 'Возможно, эта - ', topic, mathId[topic]); k++; break;}
                  }
            }
      }
  })
if ( k > 0 ) { bot.sendSticker(fromId, 'stickers/sticker3.webp'); }
else { bot.sendSticker(fromId, 'stickers/sticker4.webp') }
})
