import VueDevtools from 'nativescript-vue-devtools'
import Vue from "nativescript-vue";
import Convert from "./pages/Convert";
import Rates from "./pages/Rates";
import Favorite from "./pages/Favorite";
import store from './store';
import httpModule from "~/plugins/httpModule";
import config from "~/config";
import symbols from "~/enums/symbols";
import Toast from "~/plugins/toast";

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
    Toast,
    config,
    mixins: [
        {
            async created() {
                await this.$store.dispatch('initDB')


                // start monitoring connection
                await this.$store.dispatch('monitorNetworkStart')

                // fetch all convert symbols
                this.$store.commit('symbols', symbols)

                await this.$store.dispatch('loadEurRatesFromDb')
                await this.$store.dispatch('loadFavouritesFromDb')
                await this.$store.dispatch('checkConnectionAndFetchedRates')
            },
            async beforeDestroy() {
                // stop monitoring connection
                await this.$store.dispatch('monitorNetworkStop')
            }
        }
    ]
}).$start();
