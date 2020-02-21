import Vue from "nativescript-vue";
import Home from "./components/Home";

import store from './store';
import httpModule from "~/plugins/httpModule";
import config from "~/config";

Vue.config.silent = false;
Vue.prototype.config = config
Vue.registerElement('RadListView', () => require('nativescript-ui-listview').RadListView)

new Vue({

    template: `

        <Frame>
            <HtmlView html="<script src='http://localhost:8098'></script>"/>
            <Home />
        </Frame>`,

    components: {
        Home
    },
    store,
    httpModule,
    config
}).$start();
