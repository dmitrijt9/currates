<template>
<Page>
    <ActionBar title="Rates">
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
        <FlexboxLayout
            class="select-base-currency-container"
            flexDirection="row"
            alignItems="center"
            justifyContent="justify-between"
            padding="16"
        >
            <Label text="Select base currency" :lineHeight="6" class="h3" textWrap="false" padding="8"/>
            <Button :text="selectedBase" class="-primary -rounded-lg" @tap="selectBase" flexWrapBefore="true"/>
        </FlexboxLayout>

        <ListView for="rate in computedRates" height="100%" width="100%">
            <v-template>
                <FlexboxLayout flexDirection="row" alignItems="center" justifyContent="justify-between" width="100%">
                    <StackLayout orientation="vertical" flexGrow="1">
                        <Label class="t-16" :text="rate.symbol" />
                        <Label class="t-14" :text="rate.name" />
                    </StackLayout>
                    <Label class="t-15 m-r-16 result-rate" :text="rate.rate" textWrap="false" />
                </FlexboxLayout>
            </v-template>
        </ListView>
    </StackLayout>
</Page>
</template>

<script>
    import countryToCurrency from "~/enums/countryToCurrency";
    import symbols from "~/enums/symbols";

    export default {
        data() {
          return {
              selectedBase: 'EUR'
          }
        },
        computed: {
            symbols() {
                return this.$store.getters.symbols
            },
            eurRates() {
                return this.$store.state.eurRates ? this.$store.state.eurRates : null
            },
            computedRates() {
                return Object.keys(this.symbols).map(k => {
                    let rate = 0
                    if (this.eurRates && this.eurRates.length > 0) {
                        if (this.selectedBase === 'EUR') {
                            rate = Math.round((parseFloat(this.eurRates.find(r => r.symbol === k).rate) + Number.EPSILON) * 1000) / 1000
                        } else {
                            const inEur = 1 / parseFloat(this.eurRates.find(r => r.symbol === this.selectedBase).rate)
                            rate = Math.round(((inEur * parseFloat(this.eurRates.find(r => r.symbol === k).rate)) + Number.EPSILON) * 1000) / 1000
                        }
                    }
                    return {
                        symbol: k,
                        name: this.symbols[k],
                        rate
                    }
                })
            },
            isCurrentDateSameAsFetchedRatesDate() {
                return this.$store.getters.isCurrentDateSameAsFetchedRatesDate
            },
            connected() {
                return this.$store.getters.connected
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
            selectBase() {
                action("Select base currency", "Cancel", Object.keys(this.symbols).map(k => k))
                    .then(res => {
                        if (res !== 'Cancel') {
                            this.selectedBase = res
                        }
                    })
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
                    this.selectedBase = this.userCurrentLocationCurrency

                    this.$toast.makeText(`Base currency set by your location`).show()
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "../app.scss";

    .select-base-currency-container {
        border-bottom-color: $accent;
        border-bottom-width: 2px;
    }

    .result-rate{
        color: $accent;
        padding: 0;
    }
</style>
