import VueDevtools from 'nativescript-vue-devtools'
import Vue from "nativescript-vue";
import Convert from "./pages/Convert";
import Rates from "./pages/Rates";
import Favorite from "./pages/Favorite";
import store from './store';
import httpModule from "~/plugins/httpModule";
import database from "~/plugins/database";
import config from "~/config";
import symbols from "~/enums/symbols";

Vue.config.silent = false;
Vue.prototype.config = config
Vue.use(VueDevtools, { host: '192.168.0.145' })
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
    database,
    config,
    mixins: [
        {
            async created() {
                // fetch all convert symbols
                this.$store.commit('symbols', symbols)

                // start monitoring connection
                await this.$store.dispatch('monitorNetworkStart')

                await this.$store.dispatch('loadEurRatesFromDb')
            },
            async beforeDestroy() {
                // stop monitoring connection
                await this.$store.dispatch('monitorNetworkStop')
            }
        }
    ]
}).$start();
