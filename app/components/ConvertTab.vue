<template>
    <StackLayout>
        <!--        <Label text="" class="h1 text-center p-t-16"></Label>-->
        <Label v-if="conversionResult" :text="conversionResult" class="h1 text-center"></Label>
        <FlexboxLayout flexDirection="row" alignItems="center" justifyContent="space-around" margin="16">
            <Button :text="selectedSymbolBase" class="btn -primary -rounded-lg" @tap="selectBase"/>

            <Button text.decode="&#xf362;" class="-primary fas -rounded-sm" @tap="switchBaseTo"/>
            <Button :text="selectedSymbolTo" class="-primary -rounded-lg" @tap="selectTo"/>
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
                selectedSymbolBase: 'EUR',
                selectedSymbolTo: 'EUR',
                enteredValue: null
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
                        this.selectedSymbolBase = res
                    })
            },
            selectTo() {
                action("Select to currency", "Cancel", this.symbols)
                    .then(res => {
                        this.selectedSymbolTo = res
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
                })
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "../app.scss";
</style>
