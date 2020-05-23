<template>
    <StackLayout class="m-y-24" backgroundColor="white" height="100%" width="100%">
        <Label text="Add to favourites" horizontalAlignment="center" class="t-20 c-black p-t-8" />
        <exchange-pair horizontalAlignment="center" class="p-t-0" v-model="selectedCurrencies"/>
        <StackLayout width="100%" class="p-y-16">
            <Button @tap="$modal.close()" text="Cancel" class="-rounded-lg -outline" />
            <Button @tap="saveFavourite" text="Save" class="-rounded-lg -primary" />
        </StackLayout>
    </StackLayout>
</template>

<script>
    import exchangePair from "~/components/exchangePair";
    export default {
        components: {
            exchangePair
        },
        data() {
            return {
                selectedCurrencies: {
                    base: 'EUR',
                    target: 'CZK'
                }
            }
        },
        methods: {
            saveFavourite() {
                this.$modal.close(this.selectedCurrencies)
            }
        }
    }
</script>
