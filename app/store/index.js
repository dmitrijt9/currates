import Vue from 'nativescript-vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

const store = new Vuex.Store({
    state: {
        // array of currency symbols
        symbols: [
            "EUR",
            "CAD",
            "HKD",
            "ISK",
            "PHP",
            "DKK",
            "HUF",
            "CZK",
            "AUD",
            "RON",
            "SEK",
            "IDR",
            "INR",
            "BRL",
            "RUB",
            "HRK",
            "JPY",
            "THB",
            "CHF",
            "SGD",
            "PLN",
            "BGN",
            "TRY",
            "CNY",
            "NOK",
            "NZD",
            "ZAR",
            "USD",
            "MXN",
            "ILS",
            "GBP",
            "KRW",
            "MYR"
        ],
        // array of ongoing tasks. We keep track of the tasks to show/hide the
        // activity indicator in the groceries page.
        processingTasks: []
    },
    mutations: {

    },
    actions: {

    },
    getters: {
        symbols(state) {
            return state.symbols
        }
    },
    strict: debug,
});

Vue.prototype.$store = store;

export default store;
