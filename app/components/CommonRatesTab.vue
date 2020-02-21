<template>
    <StackLayout>
        <Label text="Common rates" class="h1 text-center p-16"></Label>
        <ListView for="symbol in symbols">
            <v-template>
                <Label :text="symbol" />
            </v-template>
        </ListView>
    </StackLayout>
</template>

<script>
    export default {
        computed: {
            symbols() {
                return this.$store.getters.symbols
            }
        }
    }
</script>
