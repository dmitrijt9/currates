<template>
<Page>
    <ActionBar title="Convert">
        <ActionItem
            ios.systemIcon="13" ios.position="right"
            android.systemIcon="ic_popup_sync" android.position="actionBar"
        />
    </ActionBar>
    <StackLayout>
        <exchange-pair
            v-model="selectedCurrencies"
        />
        <exchange-input
            class="m-x-16"
            @input="(v) => enteredValue = parseInt(v)"
        />
        <!-- Convert action buttons -->
        <FlexboxLayout flexDirection="column" alignItems="center" justifyContent="space-between" margin="16">
            <Button text="Convert" fontSize="20" paddingLeft="20" paddingRight="20" class="-primary -rounded-lg" @tap="computeExchangeRate"/>
            <Button text.decode="&#xf004;" class="-outline -rounded-lg fas t-18" color="white" @tap="addToFavorites" />
        </FlexboxLayout>

        <StackLayout class="hr m-10"></StackLayout>

        <transition name="bounce">
            <exchange-result
                class="m-x-30"
                v-if="isResult"
                ref="exchangeResult"
                :exchangeResult="exchangeResult" />
        </transition>
    </StackLayout>
</Page>
</template>

<script>
    import exchangePair from '../components/exchangePair'
    import exchangeInput from '../components/exchangeInput'
    import exchangeResult from '../components/exchangeResult'
    var enums = require("tns-core-modules/ui/enums");

    export default {
        components: {
            exchangePair,
            exchangeInput,
            exchangeResult
        },
        data() {
            return {
                exchangeResult: 0,
                enteredValue: 1,
                isResult: false,
                selectedCurrencies: {
                    base: 'EUR',
                    target: 'CZK'
                }
            }
        },
        computed: {
            connected() {
                return this.$store.getters.connectionType !== 'none'
            },
            eurRates() {
                return this.$store.state.eurRates ? this.$store.state.eurRates : null
            },
            isCurrentDateSameAsFetchedRatesDate() {
                return this.$store.state.eurRates
                    ? new Date().setHours(0,0,0,0) === new Date(this.$store.state.ratesDate).setHours(0,0,0,0)
                    : false
            }
        },
        methods: {
            async computeExchangeRate() {
                this.isResult = false
                if (this.connected) {
                    if (!this.eurRates || !this.isCurrentDateSameAsFetchedRatesDate) {
                        await this.$store.dispatch('fetchEurRates')
                        await this.$store.dispatch('loadEurRatesFromDb')
                    }
                } else {
                    if (!this.eurRates) {
                        alert({
                            title: "Please, connect to an internet",
                            message: "We need to load an exchange data before first conversion. Then the app will work offline and download latest rates only when connected.",
                            okButtonText: "OK"
                        })
                        return
                    }
                }

                if (this.selectedCurrencies.base === 'EUR') {
                    this.exchangeResult = Math.round(((this.enteredValue * parseFloat(this.eurRates.find(r => r.symbol === this.selectedCurrencies.target).rate)) + Number.EPSILON) * 100) / 100
                } else if (this.selectedCurrencies.target === 'EUR') {
                    this.exchangeResult = Math.round(((this.enteredValue / parseFloat(this.eurRates.find(r => r.symbol === this.selectedCurrencies.base).rate)) + Number.EPSILON) * 100) / 100
                } else {
                    const inEur = this.enteredValue / parseFloat(this.eurRates.find(r => r.symbol === this.selectedCurrencies.base).rate)
                    this.exchangeResult = Math.round(((inEur * parseFloat(this.eurRates.find(r => r.symbol === this.selectedCurrencies.target).rate)) + Number.EPSILON) * 100) / 100
                }
                this.isResult = true
            },
            addToFavorites() {
                confirm({
                    title: "Add to favorites?",
                    message: `Add ${this.selectedCurrencies.base} -> ${this.selectedCurrencies.target} to favourites?`,
                    okButtonText: "Yes",
                    cancelButtonText: "No",
                    neutralButtonText: 'Cancel'
                }).then(async (result) => {
                    // result argument is boolean
                    if (result) {
                        await this.$store.dispatch('addToFavourites', {...this.selectedCurrencies})
                        await this.$store.dispatch('fetchFavourites')
                    }
                });
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "../app.scss";

    .conversion-value-container {
        background-color: $complementary-color;
    }

    .conversion-result-container {
        background-color: $complementary;

        .conversion-result-number {
            color: black;
        }
    }

    .currency-select-btn {
        color: red;
        background-color: $complementary;
    }

</style>
