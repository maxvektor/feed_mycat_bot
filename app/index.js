const feeder = require('./feeder');
const TelegramBot = require('node-telegram-bot-api');
const config = require('../config');
const _ = require('lodash');
const  moment = require('moment');

const COMMANDS = {
    status: 'статус',
    give: 'дать',
    history: 'история',
    clear: 'очистить'
};

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
    const chatId = msg.chat.id;
    const input = msg.text.toLowerCase();
    const number = _.get(input.match(/\d+/), '[0]');
    let message;

    if (input.includes(COMMANDS.status)) {
        message = feeder.getStatus();
    } else if (input.includes(COMMANDS.clear)) {
        message = feeder.clear();
    } else if (number) {
        message = feeder.feed(Number(number));
    }

    console.log(message);
    // send a message to the chat acknowledging receipt of their message
    bot.sendMessage(chatId, message);
});

console.log('app is runnig');