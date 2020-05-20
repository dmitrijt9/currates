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
            state.favourites = [];
            for(let i = 0; i < favourites.length; i++) {
                state.favourites.push({
                    id: favourites[i][0],
                    base: favourites[i][1],
                    target: favourites[i][2]
                });
            }

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
            const statement3 = 'CREATE TABLE IF NOT EXISTS favourites (id INTEGER PRIMARY KEY AUTOINCREMENT, base TEXT, target TEXT)'
            const toExecute = [statement1, statement2,statement3];
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
        },
        async addToFavourites({commit, state}, { base, target }) {
            try {
                const pair = state.favourites.find(f => f.base === base && f.target === target)
                if (!pair) {
                    await state.database.execSQL("INSERT INTO favourites (base, target) VALUES (?,?)", [base, target])
                }
            } catch (e) {
                console.error(e.message)
            }
        },
        async deleteFavourite({commit, state}, id) {
            try {
                await state.database.execSQL(`DELETE FROM favourites WHERE id=${id}`)
            } catch (e) {
                console.error(e.message)
            }
        },
        loadFavouritesFromDb({ commit, state }) {
            state.database.all("SELECT * FROM favourites").then(result => {
                commit("favourites", result);
            }, error => {
                console.error("Load favourites ERROR", error);
            });
        },
        /**
         * If app doesn't have any exchange rates data and is not connected to the internet, then show message to the user to connect
         * @returns {Promise<void>}
         */
        async checkConnectionAndFetchedRates({ dispatch, state, getters }) {
            if (getters.connected) {
                if (!state.eurRates || !getters.isCurrentDateSameAsFetchedRatesDate) {
                    await dispatch('fetchEurRates')
                    await dispatch('loadEurRatesFromDb')
                }
            } else {
                if (!state.eurRates) {
                    alert({
                        title: "Please, connect to an internet",
                        message: "We need to load an exchange data before first conversion. Then the app will work offline and download latest rates only when connected.",
                        okButtonText: "OK"
                    })
                }
            }
        }
    },
    getters: {
        symbols(state) {
            return state.symbols
        },
        connectionType(state) {
            return state.connectionType
        },
        isCurrentDateSameAsFetchedRatesDate(state) {
            return state.eurRates
                ? new Date().setHours(0,0,0,0) === new Date(state.ratesDate).setHours(0,0,0,0)
                : false
        },
        connected(state) {
            return state.connectionType !== 'none'
        }
    },
    strict: debug,
});

Vue.prototype.$store = store;

export default store;
