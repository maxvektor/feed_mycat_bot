var moment = require('moment');

module.exports = {
    eaten: 0,

    resetTime: moment({hour: 15, minute: 10}),

    lastFeed: moment(),

    setResetTime: function (time) {
        this.resetTime = moment(time, "HH:mm");
    },

    updateLastFeed: function () {
        lastFeed = moment.now()
    },

    getLastFeed: function () {
        return moment(lastFeed).fromNow();
    },

    feed: function (amount) {
        this.eaten = this.eaten + parseInt(amount);
        this.updateLastFeed();
    },

    correct: function (amount) {
        this.eaten = this.eaten + amount;
    }
};