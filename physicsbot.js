var lecturesId = require('./lecturesId');
var TelegramBot = require('node-telegram-bot-api');

var token_polytech = '645936739:AAGGlE7YDgguTykQUa2jRdIzuJ0lLWk88lE';

var bot = new TelegramBot(token_polytech, {polling: true});

var makeSure = (keys, topic) => {
  let str = '';
  keys.forEach(x => { if (lecturesId[x].indexOf(topic) != -1)  { str+=x; } });
  return str;
};

var sendGuess = (fromId, msg, topic, str) => {
    bot.sendMessage(fromId, msg + topic.slice(topic.indexOf('/') + 1) + ' /' + str.slice(1));
}

var getTopicList = (keys) => {
  var topics = [];
  keys.forEach(x => {
    let name = lecturesId[x].slice(lecturesId[x].indexOf('/') + 1, lecturesId[x].indexOf('.pdf'));
    topics.push(name);
    });
  return topics;
  }

bot.onText(/\/start/, function(msg) {
  var fromId = msg.chat.id;
  var mes = "Привет! Я бот, который кидает тебе конспекты по физике. Чтобы посмотреть список тем - напиши мне 'Добрый Козачук, помоги' :)";
  bot.sendMessage(fromId, mes);
})

bot.onText(/добрый козачук, помоги/i, function(msg) {
  var fromId = msg.chat.id;
  bot.sendMessage(fromId, "Вот список тем! Выбери одну и напиши мне ее название :)");
  var keys = Object.keys(lecturesId);
  var topics = getTopicList(keys);
  var topicMessage = '';
  var k = 1;
  topics.forEach(topic => {
      topicMessage += topic + ` - /${k}`+'\n';
      k++;
  })
  bot.sendMessage(fromId, topicMessage);
  bot.sendSticker(fromId, 'stickers/sticker.webp');
});

bot.on('message', function(msg) {
    var fromId = msg.chat.id;
      if (msg.text[0] == '/') {
      let str = 'l' + msg.text.slice(1, msg.text.length);
      var doc = `${lecturesId[str]}`;
      if (doc) {
      if ((Number(msg.text.slice(1, msg.text.length)) > 0) && (Number(msg.text.slice(1, msg.text.length)) <= 41)) {
      bot.sendDocument(fromId, doc);
      bot.sendSticker(fromId, 'stickers/sticker2.webp');
      }
    }
  }
    else if (msg.text.length > 2) {
      var keys = Object.keys(lecturesId);
      var topics = getTopicList(keys);
      let k=0;
      topics.forEach(topic => {if (topic.toLowerCase().indexOf(msg.text.toLowerCase()) != -1) {
          let str = makeSure(keys, topic);
          if (topic.slice(topic.indexOf('/') + 1).toLowerCase() == msg.text.toLowerCase()) {
                var doc = `${lecturesId[str]}`;
                bot.sendDocument(fromId, doc);
                bot.sendSticker(fromId, 'stickers/sticker2.webp');
           }
          else {
            switch(k) {
              case 0: { sendGuess(fromId, 'Похоже, ты имел в виду ', topic, str); k++; break;}
              case 1: { sendGuess(fromId, 'А может эту - ', topic, str); k++; break;}
              case 2: { sendGuess(fromId, 'Я хз, крч, выражайся яснее, наверно вот эта - ', topic, str); k++; break;}
              default: { sendGuess(fromId, 'Возможно, эта - ', topic, str); k++; break;}
            }
            }
       }
     })
     if ( k > 0 ) { bot.sendSticker(fromId, 'stickers/sticker3.webp'); }
    }
    else { bot.sendSticker(fromId, 'stickers/sticker4.webp') }
});
