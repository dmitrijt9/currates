import Vue from 'nativescript-vue';
import Vuex from 'vuex';
import config from '~/config';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

const store = new Vuex.Store({
    state: {
        // array of currency symbols
        symbols: null,
        config
    },
    mutations: {
        symbols(state, symbols) {
            state.symbols = symbols
        }
    },
    actions: {
        async fetchSymbols({ commit }) {
            const { success, symbols } = await this._vm.$http.getJSON(`${config.api.baseUrl}symbols?access_key=${config.api.key}`)
            commit('symbols', success ? symbols : [])
        }
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
