import Vue from "nativescript-vue";

import Home from "./components/Home";
Vue.config.silent = false;

new Vue({

    template: `
        <Frame>
            <Home />
        </Frame>`,

    components: {
        Home
    }
}).$start();
