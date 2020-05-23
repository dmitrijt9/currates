<template>
<Page>
    <ActionBar title="Convert">
        <ActionItem
                @tap="getUserLocation"
                ios.position="right"
                icon.decode="font://&#xf124;"
                class="fas t-10"
        />
        <ActionItem
            @tap="refetchEurRates"
            ios.position="right"
            icon.decode="font://&#xf021;"
            class="fas t-10"
        />
    </ActionBar>
    <StackLayout>
        <exchange-pair
            class="exchange-pair"
            v-model="selectedCurrencies"
        />
        <exchange-input
            class="m-x-16"
            :value="enteredValue"
            @input="(v) => enteredValue = parseInt(v)"
        />
        <!-- Convert action buttons -->
        <FlexboxLayout flexDirection="row" alignItems="center" justifyContent="flex-end" margin="16">
            <Button text="Convert" fontSize="20" paddingLeft="20" paddingRight="20" class="convert-button -primary -rounded-lg" @tap="computeExchangeRate"/>
            <Button text.decode="&#xf004;" class="-outline -rounded-lg fas t-18" @tap="addToFavorites" />
        </FlexboxLayout>

        <StackLayout class="hr m-10"></StackLayout>

        <transition name="bounce">
            <exchange-result
                class="exchange-result m-x-30"
                v-show="isResult"
                ref="exchangeResult"
                :exchangeResult="exchangeResult"
            />
        </transition>
        <StackLayout v-if="favourites && favourites.length > 0" class="favourites-list m-y-16 m-x-30" backgroundColor="#4ebaaa" borderRadius="50%">
            <Label text="Pick from your favourites" horizontalAlignment="center" :lineHeight="6" textWrap="false" padding="8" class="t-12"/>
            <FavouritesList :items="favourites" :on-tap="applyFavouritePair" />
        </StackLayout>
    </StackLayout>
</Page>
</template>

<script>
    import exchangePair from '../components/exchangePair'
    import exchangeInput from '../components/exchangeInput'
    import exchangeResult from '../components/exchangeResult'
    import FavouritesList from "~/components/favouritesList";
    import symbols from "~/enums/symbols";
    import countryToCurrency from "~/enums/countryToCurrency";

    export default {
        components: {
            FavouritesList,
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
            },
            favourites() {
                return this.$store.state.favourites
            },
            userCurrentLocationCurrency() {
                if (this.$store.state.userLocation) {
                    const _currency = countryToCurrency[this.$store.state.userLocation]
                    if (symbols[_currency]) {
                        return _currency
                    }
                }
                return null
            }
        },
        methods: {
            async computeExchangeRate() {
                this.isResult = false

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
                        await this.$store.dispatch('loadFavouritesFromDb')
                        this.$toast.makeText(`${this.selectedCurrencies.base} -> ${this.selectedCurrencies.target} added to favourites`).show()
                    }
                });
            },
            applyFavouritePair({ item }) {
                this.selectedCurrencies.base = item.base
                this.selectedCurrencies.target = item.target
                this.$toast.makeText(`Favourite pair applied.`).show()
            },
            async refetchEurRates() {
                if (!this.isCurrentDateSameAsFetchedRatesDate) {
                    if (this.connected) {
                        await this.$store.dispatch('fetchEurRates')
                        await this.$store.dispatch('loadEurRatesFromDb')
                    } else {
                        this.$toast.makeText(`Please connect to receive latest exchange rates.`).show()
                    }
                } else {
                    this.$toast.makeText(`Latest exchange rates already fetched.`).show()
                }
            },
            async getUserLocation() {
                await this.$store.dispatch('getUserLocation')
                if (this.userCurrentLocationCurrency) {
                    this.selectedCurrencies.base = this.userCurrentLocationCurrency

                    this.$toast.makeText(`Base currency set by your location`).show()
                }
            },
            async loadRatesFromDb() {
                await this.$store.dispatch('loadEurRatesFromDb')
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

    .favourites-list {
        color: black;
    }

</style>
