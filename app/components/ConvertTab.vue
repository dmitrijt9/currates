<template>
    <StackLayout>
        <FlexboxLayout class="conversion-value-container" height="70" justifyContent="flex-start">
            <TextView
                    v-model="enteredValue"
                    editable="true"
                    fontSize="32"
                    width="100%"
                    keyboardType="number"
                    returnKeyType="done"
            />
        </FlexboxLayout>

        <FlexboxLayout flexDirection="row" alignItems="center" justifyContent="space-around" margin="16">
            <Button :text="selectedSymbolBase" class="-primary -rounded-lg" @tap="selectBase"/>
            <Button text.decode="&#xf362;" class="-outline fas -rounded-sm" @tap="switchBaseTo"/>
            <Button :text="selectedSymbolTo" class="-primary -rounded-lg" @tap="selectTo"/>
        </FlexboxLayout>
        <FlexboxLayout flexDirection="row" alignItems="center" justifyContent="space-around" margin="16">
            <Button text="Convert" class="convert-button" @tap="computeExchangeRate"/>
            <Button text="Add to Favourites" class="-outline -rounded-sm" @tap="computeExchangeRate"/>
        </FlexboxLayout>

        <FlexboxLayout ref="conversionResult" class="conversion-result-container" height="70" justifyContent="flex-end">
            <TextView
                    :text="conversionResult"
                    class="conversion-result-number"
                    editable="false"
                    fontSize="32"
                    width="100%"
                    keyboardType="number"
                    returnKeyType="done"
            />
        </FlexboxLayout>

    </StackLayout>
</template>

<script>
    var enums = require("tns-core-modules/ui/enums");

    export default {
        data() {
            return {
                conversionResult: 0,
                selectedSymbolBase: 'EUR',
                selectedSymbolTo: 'EUR',
                enteredValue: 0
            }
        },
        computed: {
            symbols() {
                return this.$store.getters.symbols
            }
        },
        methods: {
            selectBase() {
                action("Select base currency", "Cancel", this.symbols)
                    .then(res => {
                        if (res !== 'Cancel') {
                            this.selectedSymbolBase = res
                        }
                    })
            },
            selectTo() {
                action("Select to currency", "Cancel", this.symbols)
                    .then(res => {
                        if (res !== 'Cancel') {
                            this.selectedSymbolTo = res
                        }
                    })
            },
            switchBaseTo() {
                const tmp = this.selectedSymbolBase
                this.selectedSymbolBase = this.selectedSymbolTo
                this.selectedSymbolTo = tmp
            },
            computeExchangeRate() {
                if (this.enteredValue === null) {
                    this.enteredValue = 1
                }

                const queryString =
                    this.symbols[this.selectedSymbolBase] === 'EUR'
                        ? this.symbols[this.selectedSymbolTo]
                        : `${this.symbols[this.selectedSymbolBase]},${this.symbols[this.selectedSymbolTo]}`

                this.$http.getJSON(`${this.config.api.baseUrl}symbols=${queryString}`).then(r => {
                    this.conversionResult = parseInt(this.enteredValue) * parseInt(r.rates[this.symbols[this.selectedSymbolTo]])
                    this.$refs.conversionResult.animate({
                        translate: { x: 0, y: 100},
                        duration: 1000,
                        curve: enums.AnimationCurve.easeIn
                    })
                })
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

</style>
