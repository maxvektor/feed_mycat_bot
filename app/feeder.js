const moment = require('moment');
const fs = require('fs');
const _ = require('lodash');
const fileName = './store.json';

const LAST_FEED = 'lastFeed';

fs.readFile(fileName,function (err) {
   if (err){
       console.log('no store file');
       fs.writeFileSync(fileName,'{}');
       console.log('store file created')
   }
});

module.exports = {

    updateLastFeed: function (store, now) {
        _.set(store, LAST_FEED, now.unix());
    },

    getLastFeed: function () {
        const lastFeed = _.get(JSON.parse(fs.readFileSync(fileName)), LAST_FEED);

        return lastFeed ? moment.unix(lastFeed).fromNow() : 'unknown';
    },

    feed: function (amount) {
        const now = moment();
        const todayPath = this._getTodaysPath(now);

        let fileStore = JSON.parse(fs.readFileSync(fileName));
        let todayInStore = this._getTodayInStore(fileStore, now);

        let feed = {
            time: now.unix(),
            amount: amount
        };

        if (todayInStore) {
            todayInStore.push(feed);
        } else {
            _.set(fileStore, todayPath, [].concat(feed));
        }

        this.updateLastFeed(fileStore, now);

        fs.writeFileSync(fileName, JSON.stringify(fileStore));

        return `Покормили. Дали ${amount} грамм еды`;
    },

    getStatus: function () {
        const now = moment();
        const fileStore = JSON.parse(fs.readFileSync(fileName));
        const todayInStore = this._getTodayInStore(fileStore, now);

        return `За сегодня котик съела ${_.sum(_.map(todayInStore, 'amount'))} грамм еды.`;
    },

    clear: function () {
        const now = moment();
        const fileStore = JSON.parse(fs.readFileSync(fileName));
        const todayPath = this._getTodaysPath(now);

        _.set(fileStore, todayPath, []);

        fs.writeFileSync(fileName, JSON.stringify(fileStore));

        return 'Очистили данные за сегодня';
    },

    _getTodaysPath: function (now) {
        return `_dates._${now.get('year')}._${now.get('month') + 1}._${now.get("date")}`;
    },

    _getTodayInStore: function (store, now) {
        const todayPath = this._getTodaysPath(now);
        return _.get(store, todayPath);
    }
};