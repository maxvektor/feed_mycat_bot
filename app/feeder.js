const moment = require('moment');
const fs = require('fs');
const _ = require('lodash');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const feedingSchema = require('./schemas/feedingSchema');
const Feeding = mongoose.model('Feeding', feedingSchema);
const pluralize = require('numeralize-ru').pluralize;

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
                    const sum = _.sum(_.map(data, 'amount'));
                    return `За сегодня котик съела ${sum} ${pluralize(sum, 'грамм', 'грамма', 'грамм')} еды.`;
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
                        return `За последние ${interval} ${pluralize(interval, 'час', 'часа', 'часов')} `+
                                `котик ничего не ела`
                    } else {
                        // только не нулевые
                        const feedings = _.filter(data, 'amount');
                        const sum = _.sum(_.map(data, 'amount'));

                        let feedingString = _.map(feedings, function (item) {
                            return `${moment(item.time).locale('ru').format('D MMMM HH:mm')} – ` +
                                `${item.amount} ${pluralize(item.amount, 'грамм', 'грамма', 'грамм')}`
                        }).join('\n');

                        return `За последние ${interval} ${pluralize(interval, 'час', 'часа', 'часов')} ` +
                            `котик ела ${feedings.length} ${pluralize(feedings.length, 'раз', 'раза', 'раз')}:`
                            + `\n\n${feedingString}`
                            +`\n\nвсего ${sum} ${pluralize(sum, 'грамм', 'грамма', 'грамм')} еды`
                    }
                },
                err => {
                    console.log(err);
                    return `Ошибка: ${err}`
                }
            );
    }
};