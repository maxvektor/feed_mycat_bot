const moment = require('moment');
const fs = require('fs');
const _ = require('lodash');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const feedingSchema = require('./schemas/feedingSchema');
const Feeding = mongoose.model('Feeding', feedingSchema);

mongoose.connect('mongodb://localhost/db');

module.exports = {

    feed: function (amount, date) {
        const feeding = new Feeding({
            amount: amount,
            // unix timestamp to js date
            time: new Date(date * 1000)
        });

        return feeding
            .save()
            .then(
                result => {
                    return `Покормили. Дали ${result.amount} грамм еды`;
                },
                err => {
                    console.log(err);
                    return `Ошибка: ${err}`
                }
            );
    },

    getStatus: function (amount) {
        return Feeding.findToday()
            .then(
                data => {
                    return `За сегодня котик съела ${_.sum(_.map(data, 'amount'))} грамм еды.`;
                },
                err => {
                    console.log(err);
                    return `Ошибка: ${err}`
                }
            );
    },

    getHistory: function (interval) {
        return Feeding.getFeedByInterval(interval)
            .then(
                data => {
                    if (_.isEmpty(data)) {
                        return `За последние ${interval}ч котик ничего не ела`
                    } else {
                        // только не нулевые
                        const feedings = _.filter(data,'amount');
                        let feedingString = _.map(feedings, function (item) {
                            return `${moment(item.time).format('Do MMM HH:mm')} - ${item.amount} грамм`
                        }).join('\n');

                        return `За последние ${interval}ч котик ела ${feedings.length} раз: \n\n${feedingString}`;
                    }
                },
                err => {
                    console.log(err);
                    return `Ошибка: ${err}`
                }
            );
    }
};