<template>
    <StackLayout>
        <Label text="Convert" class="h1 text-center p-t-16"></Label>
        <Label v-if="conversionResult" :text="conversionResult" class="h1 text-center"></Label>
        <FlexboxLayout flexDirection="row" alignItems="center" justifyContent="space-around" margin="16">
            <ListPicker
                    class="currency-picker"
                    :items="symbols"
                    selectedIndex="0"
                    height="150"

                    v-model="selectedSymbolBase"
            />
            <Button text.decode="&#xf362;" class="-primary fas -rounded-sm" @tap="switchBaseTo"/>

            <ListPicker
                    class="currency-picker"
                    :items="symbols"
                    selectedIndex="0"
                    height="150"
                    v-model="selectedSymbolTo"
            />
        </FlexboxLayout>
        <FlexboxLayout flexDirection="row" alignItems="center" justifyContent="space-around" margin="16">
            <TextField
                    v-model="enteredValue"
                    hint="Type amount"
                    keyboardType="number"
                    returnKeyType="go"
                    fontSize="24"
                    width="300"
                    borderWidth="2"
                    borderRadius="5"
                    class="p-8"
            />
            <Button text.decode="&#xf00c;" class="-primary fas -rounded-sm" @tap="computeExchangeRate"/>
        </FlexboxLayout>

    </StackLayout>
</template>

<script>
    export default {
        data() {
            return {
                conversionResult: null,
                selectedSymbolBase: null,
                selectedSymbolTo: null,
                enteredValue: null
            }
        },
        computed: {
            symbols() {
                return this.$store.getters.symbols
            }
        },
        methods: {
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
                })
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "~@nativescript/theme/lime";

    .currency-picker {
        color: white;
    }
</style>
