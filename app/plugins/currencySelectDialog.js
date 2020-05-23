import Vue from 'nativescript-vue';
import rateSymbolsDialog from '~/components/rateSymbolsDialog'

async function selectCurrency() {
    return await this.$showModal(rateSymbolsDialog, {
        fullscreen: false,
        stretched: true,
        cancelable: true,
        animated: true,
    })
}
Vue.prototype.$selectCurrency = selectCurrency
export default selectCurrency
