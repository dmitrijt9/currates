<template>
<FlexboxLayout flexDirection="column" alignItems="center" justifyContent="space-around" padding="8">
    <Label text="Choose your exchange pair" :lineHeight="6" textWrap="false" padding="8" class="t-12"/>
    <FlexboxLayout flexDirection="row">
        <Button :text="value.base" class="-primary -rounded-lg" @tap="selectBase" flexWrapBefore="true"/>
        <Button text.decode="&#xf362;" class="-outline fas t-18 -rounded-lg" @tap="switchBaseTo"/>
        <Button :text="value.target" class="-primary -rounded-lg" @tap="selectTo"/>
    </FlexboxLayout>
</FlexboxLayout>
</template>

<script>
export default {
    props: {
      value: {
          type: Object,
          default() {
              return {
                  base: 'EUR',
                  target: 'CZK'
              }
          }
      }
    },
    data() {
        return {
            symbolsDialogOpen: false
        }
    },
    computed: {
        symbols() {
            return this.$store.getters.symbols
        }
    },
    methods: {
        async selectBase() {
            const { symbol } = await this.$selectCurrency()
            this.$emit('input', {
                base: symbol,
                target: this.value.target
            })
        },
        async selectTo() {
            const { symbol } = await this.$selectCurrency()
            this.$emit('input', {
                base: this.value.base,
                target: symbol
            })
        },
        switchBaseTo() {
            const tmp = this.value.base
            this.value.base = this.value.target
            this.value.target = tmp
        }
    }
}
</script>
