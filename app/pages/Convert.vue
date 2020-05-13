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
            <Button text.decode="&#xf004;" class="-outline -rounded-lg fas t-18" color="white" @tap="computeExchangeRate" />
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
                },
                debug: null
            }
        },
        computed: {
            symbols() {
                return this.$store.getters.symbols
            }
        },
        methods: {
            async computeExchangeRate() {
                this.isResult = false
                const { success, error, rates } =
                    await this.$http
                        .getJSON(
                            `${this.config.api.baseUrl}latest?access_key=${this.config.api.key}&base=${this.selectedCurrencies.base}&symbols=${this.selectedCurrencies.target}`
                        )

                if (success) {
                    this.exchangeResult = Math.round(((this.enteredValue * rates[this.selectedCurrencies.target]) + Number.EPSILON) * 100) / 100
                    this.isResult = true
                } else {
                    this.debug = error
                    alert({
                        title: "Conversion failed",
                        message: "We are not able to convert currencies. Please check your connection and try again.",
                        okButtonText: "OK"
                    })
                }
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
