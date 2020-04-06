<template>
<FlexboxLayout flexDirection="column" alignItems="center" justifyContent="space-around" padding="16">
    <Label text="Choose your exchange pair" :lineHeight="6" textWrap="false" padding="8"/>
    <FlexboxLayout flexDirection="row">
        <Button :text="selectedSymbolBase" class="-primary -rounded-lg" @tap="selectBase" flexWrapBefore="true"/>
        <Button text.decode="&#xf362;" color="white" class="-outline fas t-18 -rounded-lg" @tap="switchBaseTo"/>
        <Button :text="selectedSymbolTo" class="-primary -rounded-lg" @tap="selectTo"/>
    </FlexboxLayout>
</FlexboxLayout>
</template>

<script>
export default {
    data() {
        return {
            selectedSymbolBase: 'EUR',
            selectedSymbolTo: 'CZK',
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
        }
    },
}
</script>