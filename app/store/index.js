import Vue from 'nativescript-vue';
import Vuex from 'vuex';
import config from '~/config';
const connectivity = require("connectivity");
const Sqlite = require("nativescript-sqlite");
Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

const store = new Vuex.Store({
    state: {
        database: null,
        // array of currency symbols
        symbols: null,
        config,
        // device connected to wifi, mobile data or not connected
        connectionType: 'none',
        // all exchange rates with EUR base currency
        eurRates: null,
        ratesDate: null,
        // just for dev debug purposes
        debug: null,
        // favourite exchange pairs
        favourites: null
    },
    mutations: {
        database(state, db) {
          state.database = db
        },
        symbols(state, symbols) {
            state.symbols = symbols
        },
        connectionType(state, type) {
            state.connectionType = type
        },
        eurRates(state, rates) {
            state.eurRates = [];
            for(let i = 0; i < rates.length; i++) {
                state.eurRates.push({
                    id: rates[i][0],
                    symbol: rates[i][1],
                    rate: rates[i][2]
                });
            }
        },
        favourites(state, favourites) {
          state.favourites = favourites
        },
        debug(state, debug) {
            state.debug = debug
        },
        ratesDate(state, date) {
            state.ratesDate = date
        }
    },
    actions: {
        monitorNetworkStart({ commit }) {
            connectivity.startMonitoring((newConnectionType) => {
                switch (newConnectionType) {
                    case connectivity.connectionType.none:
                        commit('connectionType', 'none')
                        break;
                    case connectivity.connectionType.wifi:
                        commit('connectionType', 'wifi')
                        break;
                    case connectivity.connectionType.mobile:
                        commit('connectionType', 'mobile')
                        break;
                }
            });
        },
        monitorNetworkStop({ commit }) {
            connectivity.stopMonitoring();
            commit('connectionType', 'none')
        },
        initDB(context) {
            const statement1 = 'CREATE TABLE IF NOT EXISTS eurRates (id INTEGER PRIMARY KEY AUTOINCREMENT, symbol TEXT, rate TEXT)'
            const statement2 = 'CREATE TABLE IF NOT EXISTS ratesDate (id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT)'
            const toExecute = [statement1, statement2];
            (new Sqlite("currates-db")).then(db => {
                toExecute.forEach(st => {
                    db.execSQL(st)
                })
                context.commit("database", db);
            }, error => {
                console.error("OPEN DB ERROR", error);
            });
        },
        async fetchEurRates({ commit, state }, data) {
            const { success, error, rates, date } =
                await this._vm.$http
                    .getJSON(
                        `${config.api.baseUrl}latest?access_key=${config.api.key}`
                    )
            if (success) {
                try {
                    await state.database.execSQL("DELETE FROM eurRates")
                    await state.database.execSQL("DELETE FROM ratesDate")
                    Object.keys(rates).forEach(symbol => {
                        state.database.execSQL("INSERT INTO eurRates (symbol, rate) VALUES (?, ?)", [symbol, rates[symbol]])
                    })
                    await state.database.execSQL("INSERT INTO ratesDate (date) VALUES (?)", [date])
                } catch (e) {
                    console.error(e.message);
                }
            } else {
                console.error(error)
            }
        },
        loadEurRatesFromDb({ state, commit }) {
            state.database.all("SELECT id, symbol, rate FROM eurRates").then(result => {
                commit("eurRates", result);
            }, error => {
                console.error("Load eur rates ERROR", error);
            });

            state.database.all("SELECT date FROM ratesDate").then(result => {
                commit("ratesDate", result.length > 0 ? result[0][0] : null);
            }, error => {
                console.error("Load eur rates ERROR", error);
            });
        }
        // async fetchEurRates({ commit, state }) {
        //     const { success, error, rates, date } =
        //         await this._vm.$http
        //             .getJSON(
        //                 `${config.api.baseUrl}latest?access_key=${config.api.key}`
        //             )
        //
        //     if (success) {
        //         if (state.eurRates === null || state.eurRates === undefined) {
        //             this._vm.$database.createDocument({
        //                 name: "eurRates",
        //                 date: date,
        //                 rates: rates
        //             })
        //         } else {
        //             this._vm.$database.updateDocument(state.eurRates.id, {
        //                 name: "eurRates",
        //                 date: date,
        //                 rates: rates
        //             })
        //         }
        //         commit('eurRates', {
        //             name: "eurRates",
        //             date: date,
        //             rates: rates
        //         })
        //     } else {
        //         commit('debug', error)
        //     }
        // },
        // loadEurRatesFromDb({ commit }) {
        //     const r = this._vm.$database.query({
        //         select: [],
        //         where: [{
        //             name: 'eurRates'
        //         }]
        //     })
        //     if (r && r[0].name === 'eurRates') {
        //         commit('eurRates', r[0])
        //     }
        //
        // },
        // addToFavourites({commit, state}, data) {
        //     this._vm.$database.inBatch(() => {
        //         // if (state.favourites === null || state.favourites === undefined) {
        //         if (true) {
        //             this._vm.$database.createDocument( {
        //                 name: "favourites",
        //                 pairs: [data]
        //             })
        //         } else {
        //             state.favourites.pairs.push(data)
        //
        //             this._vm.$database.updateDocument(state.favourites.id, {
        //                 name: "favourites",
        //                 pairs: state.favourites.pairs
        //             })
        //         }
        //     })
        // },
        // fetchFavourites({ commit }) {
        //     const favourites = this._vm.$database.query({
        //         select: [],
        //         where: {
        //             name: "favourites"
        //         }
        //     })
        //
        //     if (favourites && favourites[0].name === 'favourites') {
        //         commit('favourites', favourites[0])
        //     }
        // }
    },
    getters: {
        symbols(state) {
            return state.symbols
        },
        connectionType(state) {
            return state.connectionType
        }
    },
    strict: debug,
});

Vue.prototype.$store = store;

export default store;
