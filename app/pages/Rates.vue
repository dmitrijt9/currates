<template>
<Page>
    <ActionBar title="Rates">
        <ActionItem
            @tap="refetchEurRates"
            ios.systemIcon="13" ios.position="right"
            android.systemIcon="ic_popup_sync" android.position="actionBar"
        />
    </ActionBar>
    <StackLayout>
        <FlexboxLayout class="select-base-currency-container" flexDirection="row" alignItems="center" justifyContent="justify-between" margin="16">
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
                    if (this.selectedBase === 'EUR') {
                        rate = Math.round((parseFloat(this.eurRates.find(r => r.symbol === k).rate) + Number.EPSILON) * 1000) / 1000
                    } else {
                        const inEur = 1 / parseFloat(this.eurRates.find(r => r.symbol === this.selectedBase).rate)
                        rate = Math.round(((inEur * parseFloat(this.eurRates.find(r => r.symbol === k).rate)) + Number.EPSILON) * 1000) / 1000
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
