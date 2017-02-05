const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const feedingSchema = new Schema({
    time: {type: Date, default: Date.now},
    amount: Number
});

feedingSchema.statics.findToday = function (cb) {
    const start = new Date().setHours(0, 0, 0, 0);
    const end = new Date().setHours(23, 59, 59, 999);

    return this.find({time: {$gte: start, $lt: end}}, cb);
};

module.exports = feedingSchema;