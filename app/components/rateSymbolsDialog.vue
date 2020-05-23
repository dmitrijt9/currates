<template>
    <StackLayout margin="10" backgroundColor="white" height="100%" width="800px">
        <Label text="Select currency" class="t-16 c-black p-y-8" />
        <SearchBar
            class="currency-search"
            hint="Search currency"
            v-model="query"
            color="black"
            backgroundColor="#4ebaaa"
            textFieldHintColor="white"
        />
        <FlexboxLayout flexDirection="column" justifyContent="space-between" width="100%">
            <ListView ref="currenciesList" for="currency in searchedCurrencies" @itemTap="selectCurrency" width="100%" height="50%">
                <v-template>
                    <FlexboxLayout flexDirection="row" alignItems="center" justifyContent="justify-between" width="100%">
                        <StackLayout orientation="vertical" flexGrow="1">
                            <Label class="t-14 c-black" :text="currency.symbol" />
                            <Label class="t-12 c-black" :text="currency.name" />
                        </StackLayout>
                    </FlexboxLayout>
                </v-template>
            </ListView>
            <StackLayout width="100%">
                <Button @tap="$modal.close()" text="Cancel" class="-rounded-lg -outline" />
            </StackLayout>
        </FlexboxLayout>

    </StackLayout>
</template>

<script>
    export default {
        data() {
            return {
                query: '',
                listItems: [],
                selectedCurrency: null
            }
        },
        computed: {
            symbols() {
                return Object.keys(this.$store.getters.symbols).map(symbol => {
                    return {
                        symbol,
                        name: this.$store.getters.symbols[symbol]
                    }
                })
            },
            searchedCurrencies() {
                return this.query.trim() !== '' ? this.symbols.filter(s => {
                    const symbolAndName = s.symbol + s.name
                    return symbolAndName.toUpperCase().indexOf(this.query.toUpperCase()) > -1
                }) : this.symbols
            }
        },
        methods: {
            selectCurrency({ item }) {
                this.selectedCurrency = item
                this.$modal.close(item)
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "../app.scss";

    .currency-search {
        font-size: large;
    }
</style>
