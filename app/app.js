import VueDevtools from 'nativescript-vue-devtools'
import Vue from "nativescript-vue";
import Convert from "./pages/Convert";
import Rates from "./pages/Rates";
import Favorite from "./pages/Favorite";
import store from './store';
import httpModule from "~/plugins/httpModule";
import config from "~/config";

Vue.config.silent = false;
Vue.prototype.config = config
Vue.use(VueDevtools, { host: '192.168.0.24' })
new Vue({
    template: `

    <BottomNavigation>
        <TabStrip>
            <TabStripItem>
                <Label text.decode="&#xf153;" class="fas t-30"></Label>
            </TabStripItem>
            <TabStripItem>
                <Label text.decode="&#xf080;" class="fas t-30"></Label>
            </TabStripItem>
            <TabStripItem>
                <Label text.decode="&#xf005;" class="fas t-30"></Label>
            </TabStripItem>
        </TabStrip>

        <TabContentItem>
            <Frame>
                <Convert />
            </Frame>
        </TabContentItem>

        <TabContentItem>
            <Frame>
                <Rates />
            </Frame>
        </TabContentItem>

        <TabContentItem>
            <Frame>
                <Favorite />
            </Frame>
        </TabContentItem>
    </BottomNavigation>`,

    components: {
        Convert,
        Rates,
        Favorite
    },
    store,
    httpModule,
    config,
    mixins: [
        {
            async created() {
                // todo check connection and load from local db if not connected
                // fetch all convert symbols
                await this.$store.dispatch('fetchSymbols')
            }
        }
    ]
}).$start();
