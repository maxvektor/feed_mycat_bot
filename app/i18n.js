const pluralize_ru = require('numeralize-ru').pluralize;
const moment = require('moment');
const RU_PLURALS = {
    gram: ['грамм', 'грамма', 'грамм'],
    hour: ['час', 'часа', 'часов']
};


const i18n = {
    compose(key, lang, data) {
        if (!i18n[key]) {
            throw new Error(`i18n fo ${key} in not implemented`);
        }

        return (i18n[key][lang] || i18n[key].default)(data);
    },

    formantDate(date, lang){
        switch (lang) {
            case 'ru': {
                return moment(date).locale('ru').format('D MMMM HH:mm');
            }
            default: {
                return moment(date).format();
            }
        }
    },

    CAT_IS_FEEDED: {
        ru: function (data) {
            return `Покормили. Дали ${_plural_ru(data.amount, ...RU_PLURALS.gram)} еды`;
        },
        'default': function (data) {
            return `Cat is feeded. It ate ${_plural_eng(data.amount, 'gram')} of food`
        }
    },

    FEED_STATUS: {
        ru: function (data) {
            return `За сегодня котик съела ${i18n.FOOD_AMOUNT.ru(data.sum)} еды.`;
        },
        'default': function (data) {
            return `Cat ate ${i18n.FOOD_AMOUNT.default(data.sum)} of food`
        }
    },

    FEED_HYSTORY_EMPTY: {
        ru: function (data) {
            return `За последние ${_plural_ru(data.interval, RU_PLURALS.hour)} котик ничего не ела`
        },
        'default': function (data) {
            return `Cat ate nothing in last ${_plural_eng(data.interval, 'hour')}`
        }
    },

    FEED_HYSTORY: {
        ru: function (data) {
            return `За последние ${_plural_ru(data.interval, 'час', 'часа', 'часов')} ` +
                `котик ела ${_plural_ru(data.length, 'раз', 'раза', 'раз')}`;
        },
        'default': function (data) {
            return `Cat ate nothing in last ${_plural_eng(data.interval, 'hour')}`
        }
    },

    FOOD_AMOUNT: {
        ru: function (amount) {
            return _plural_ru(amount, ...RU_PLURALS.gram)
        },
        'default': function (amount) {
            return _plural_eng(amount, 'gram')
        }
    },

    FOOD_AMOUNT_SUM:{
        ru: function (amount) {
            return `Всего: ${_plural_ru(amount, ...RU_PLURALS.gram)}`
        },
        'default': function (amount) {
            return `Всего: ${_plural_eng(amount, 'gram')}`
        }
    }
};

function _plural_ru(count, one, two, five) {
    return `${count} ${pluralize_ru(count, one, two, five)}`;
}

function _plural_eng(count, noun) {
    return `${count} ${noun}${count !== 1 ? suffix : ''}`;
}

module.exports = i18n;
