import Vue from "nativescript-vue";
import Home from "./components/Home";
import store from './store';
import httpModule from "~/plugins/httpModule";
import config from "~/config";
import VueDevtools from "nativescript-vue-devtools";

Vue.config.silent = false;
Vue.prototype.config = config
Vue.use(VueDevtools, { host: 'localhost' })

new Vue({

    template: `

        <Frame>
            <Home />
        </Frame>`,

    components: {
        Home
    },
    store,
    httpModule,
    config
}).$start();
