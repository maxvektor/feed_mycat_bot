const moment = require('moment');
const fs = require('fs');
const _ = require('lodash');
const mongoose = require('mongoose');
const feedingSchema = require('./schemas/feedingSchema');
const Feeding = mongoose.model('Feeding', feedingSchema);
const i18n = require('./i18n');

const locale = process.env.locale || 'ru';

mongoose.connect('mongodb://mongo:27017');

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
                    return i18n.compose('CAT_IS_FEEDED', locale, result);
                },
                err => {
                    console.log(err);
                    return `Error ${err}`
                }
            );
    },

    getStatus: function (amount) {
        return Feeding.findToday()
            .then(
                data => {
                    const sum = _.sum(_.map(data, 'amount'));
                    return i18n.compose('FEED_STATUS', locale, {sum});
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
                models => {
                    const data = models.map(model => model.toObject());

                    if (_.isEmpty(data)) {
                        return i18n.compose('FEED_HYSTORY_EMPTY', locale, {interval})
                    } else {
                        // только не нулевые
                        const feedings = _.filter(data, 'amount');
                        const sum = _.sum(_.map(data, 'amount'));

                        let feedingString = _.map(feedings, function (feeding) {
                            return `${i18n.formantDate(feeding.time, locale)} – ${i18n.compose('FOOD_AMOUNT', locale, feeding.amount)}`
                        }).join('\n');

                        return [
                            i18n.compose('FEED_HYSTORY', locale, {interval, length: feedings.length}),
                            feedingString,
                            `${i18n.compose('FOOD_AMOUNT_SUM', locale, sum)}`
                        ].join('\n\n')
                    }
                },
                err => {
                    console.log(err);
                    return `Ошибка: ${err}`
                }
            );
    }
};
