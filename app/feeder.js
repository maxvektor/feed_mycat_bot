const moment = require('moment');
const fs = require('fs');
const _ = require('lodash');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const feedingSchema = require('./schemas/feedingSchema');
const Feeding = mongoose.model('Feeding', feedingSchema);

const fileName = './store.json';
const LAST_FEED = 'lastFeed';

fs.readFile(fileName, function (err) {
    if (err) {
        console.log('no store file');
        fs.writeFileSync(fileName, '{}');
        console.log('store file created')
    }
});

mongoose.connect('mongodb://localhost/db');

module.exports = {

    feed: function (amount) {
        const feeding = new Feeding({
            amount: amount,
            time: Date.now()
        });

        return feeding
            .save()
            .then(
                result => {
                    return `Покормили. Дали ${result.amount} грамм еды`;
                },
                err => {
                    console.log(err);
                });
    },

    getStatus: function (amount) {
        return Feeding.findToday()
            .then(
                data => {
                    return `За сегодня котик съела ${_.sum(_.map(data, 'amount'))} грамм еды.`;
                },
                err => {
                    console.log(data);
                }
            );
    },

    clear: function () {
        const now = moment();
        const fileStore = JSON.parse(fs.readFileSync(fileName));
        const todayPath = this._getTodaysPath(now);

        _.set(fileStore, todayPath, []);

        fs.writeFileSync(fileName, JSON.stringify(fileStore));

        return 'Очистили данные за сегодня';
    }
};