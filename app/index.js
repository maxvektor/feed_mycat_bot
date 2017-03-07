const feeder = require('./feeder');
const TelegramBot = require('node-telegram-bot-api');
const config = require('../config');
const _ = require('lodash');

const COMMANDS = {
    status: 'статус',
    give: 'дать',
    history: 'история',
    clear: 'очистить'
};

// replace the value below with the Telegram token you receive from @BotFather
var token = config.tegramToken;

// Create a bot that uses 'polling' to fetch new updates
var bot = new TelegramBot(token, {polling: true});

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, function (msg, match) {
    // 'msg' is the received Message from Telegram
    // 'match' is the result of executing the regexp above on the text content
    // of the message

    const chatId = msg.chat.id;
    const resp = match[1]; // the captured "whatever"

    // send back the matched "whatever" to the chat
    bot.sendMessage(chatId, resp);
});

// Listen for any kind of message. There are different kinds of
// messages.
bot.on('message', function (msg) {
    const chatId = msg.chat.id;
    const input = msg.text.toLowerCase();
    const number = _.get(input.match(/\d+/), '[0]');
    let message;

    const answer = _.partial(bot.sendMessage, chatId);

    if (input.includes(COMMANDS.status)) {
        // TODO: _.partial
        feeder
            .getStatus()
            .then(function (result) {
                console.log(result);
                bot.sendMessage(chatId, result);
            });
    } else if (number) {
        feeder
            .feed(Number(number), msg.date)
            .then(function (result) {
                console.log(result);
                bot.sendMessage(chatId, result);
            });
    }
});

console.log('app is runnig');