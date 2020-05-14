import Vue from 'nativescript-vue';
import Vuex from 'vuex';
import config from '~/config';
const connectivity = require("connectivity");

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

const store = new Vuex.Store({
    state: {
        // array of currency symbols
        symbols: null,
        config,
        connectionType: 'none',
        eurRates: null,
        debug: null
    },
    mutations: {
        symbols(state, symbols) {
            state.symbols = symbols
        },
        connectionType(state, type) {
            state.connectionType = type
        },
        eurRates(state, rates) {
            state.eurRates = rates
        },
        debug(state, debug) {
            state.debug = debug
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
        async fetchEurRates({ commit, state }) {
            const { success, error, rates, date } =
                await this._vm.$http
                    .getJSON(
                        `${config.api.baseUrl}latest?access_key=${config.api.key}`
                    )

            if (success) {
                if (state.eurRates === null || state.eurRates === undefined) {
                    this._vm.$database.createDocument({
                        name: "eurRates",
                        date: date,
                        rates: rates
                    })
                } else {
                    this._vm.$database.updateDocument(state.eurRates.id, {
                        name: "eurRates",
                        date: date,
                        rates: rates
                    })
                }
                commit('eurRates', {
                    name: "eurRates",
                    date: date,
                    rates: rates
                })
            } else {
                commit('debug', error)
            }
        },
        loadEurRatesFromDb({ commit }) {
            const r = this._vm.$database.query({
                select: [],
                where: [{
                    name: 'eurRates'
                }]
            })
            commit('debug', r)
            if (r) {
                commit('eurRates', r[0])
            }

        }
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
