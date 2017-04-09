const feeder = require('./feeder');
const TelegramBot = require('node-telegram-bot-api');
const config = require('../config');
const _ = require('lodash');
const console = require('console');
const version = require('../package.json').version;

const COMMANDS = {
    status: /статус/i,
    give: /дать ?(\d+)?/i,
    history: /история ?(\d+)?/i,
    clear: /очистить/i,
    version: /версия/i,
};

// replace the value below with the Telegram token you receive from @BotFather
const token = config.tegramToken;

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

bot.onText(COMMANDS.give, function (msg, match) {
    const chatId = msg.chat.id;
    let amount;

    if (match[1]) {
        amount = Number(match[1]);
        feeder
            .feed(Number(amount), msg.date)
            .then(function (result) {
                console.log(result);
                bot.sendMessage(chatId, result);
            });
    } else {
        bot.sendMessage(chatId, 'Не понятно, сколько дать');
    }
});

bot.onText(COMMANDS.status, function (msg) {
    const chatId = msg.chat.id;

    feeder
        .getStatus()
        .then(function (result) {
            console.log(result);
            bot.sendMessage(chatId, result);
        });
});

bot.onText(COMMANDS.history, function (msg, match) {
    const chatId = msg.chat.id;
    const interval = match[1] || 24;
    console.log(match);
    console.log(interval);
    feeder
        .getHistory(interval)
        .then(function (result) {
            console.log(result);
            bot.sendMessage(chatId, result);
        });
});

bot.onText(COMMANDS.version, function (msg, match) {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, version);
});

bot.on('message', function (msg) {

});

console.log('app is runnig');
