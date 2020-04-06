<template>
<Page>
    <ActionBar title="Convert">
        <ActionItem
            ios.systemIcon="13" ios.position="right"
            android.systemIcon="ic_popup_sync" android.position="actionBar" 
        />
    </ActionBar>
    <StackLayout>
        <exchange-pair />
        <exchange-input class="m-x-16" />
        <!-- Convert action buttons -->
        <FlexboxLayout flexDirection="column" alignItems="center" justifyContent="space-between" margin="16">
            <Button text="Convert" fontSize="20" paddingLeft="20" paddingRight="20" class="-primary -rounded-lg" @tap="computeExchangeRate"/>
            <Button text.decode="&#xf004;" class="-outline -rounded-lg fas t-18" color="white" @tap="computeExchangeRate" />
        </FlexboxLayout>

        <StackLayout class="hr m-10"></StackLayout>

        <transition name="bounce">
            <exchange-result class="m-x-30" v-if="isResult" conversionResult="34" />
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
                conversionResult: 0,
                enteredValue: 0,
                isResult: false
            }
        },
        computed: {
            symbols() {
                return this.$store.getters.symbols
            }
        },
        methods: {
            computeExchangeRate() {
                if (this.enteredValue === null) {
                    this.enteredValue = 1
                }

                this.isResult = true

                // const queryString =
                //     this.symbols[this.selectedSymbolBase] === 'EUR'
                //         ? this.symbols[this.selectedSymbolTo]
                //         : `${this.symbols[this.selectedSymbolBase]},${this.symbols[this.selectedSymbolTo]}`

                // this.$http.getJSON(`${this.config.api.baseUrl}symbols=${queryString}`).then(r => {
                //     this.conversionResult = parseInt(this.enteredValue) * parseInt(r.rates[this.symbols[this.selectedSymbolTo]])
                //     this.$refs.conversionResult.animate({
                //         translate: { x: 0, y: 100},
                //         duration: 1000,
                //         curve: enums.AnimationCurve.easeIn
                //     })
                // })
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
