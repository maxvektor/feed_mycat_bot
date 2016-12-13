var feeder = require('./feeder');
var TelegramBot = require('node-telegram-bot-api');
var config = require('../config');

// pretty console log
var pcl = require("pretty-console.log");
pcl.enable();

// replace the value below with the Telegram token you receive from @BotFather
var token = config.tegramToken;

// Create a bot that uses 'polling' to fetch new updates
var bot = new TelegramBot(token, {polling: true});

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, function (msg, match) {
    // 'msg' is the received Message from Telegram
    // 'match' is the result of executing the regexp above on the text content
    // of the message

    var chatId = msg.chat.id;
    var resp = match[1]; // the captured "whatever"

    // send back the matched "whatever" to the chat
    bot.sendMessage(chatId, resp);
});

// Listen for any kind of message. There are different kinds of
// messages.
bot.on('message', function (msg) {
    var chatId = msg.chat.id;


    feeder.feed(msg.text);

    console.log(feeder.eaten);

    // send a message to the chat acknowledging receipt of their message
    bot.sendMessage(chatId, [
        "Сегодня Золушка съела",
        feeder.eaten,
        "грамм еды.",
        "Зверь ела",
        feeder.getLastFeed()].join(' '));
});

console.log('app is runnig');