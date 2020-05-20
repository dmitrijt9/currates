<template>
    <ListView for="fav in items" ref="favouritesList" height="100%" width="100%" @itemTap="onTap" @loaded="fixLV">
        <v-template>
            <StackLayout orientation="horizontal">
                <Label :text="fav.base" width="33.3%" class="favourite-symbol m-l-24" />
                <Image src.decode="font://&#xf061;" stretch="none" class="fas t-10" verticalAlignment="center" width="33.3%"/>
                <Label :text="fav.target" width="33.3%" class="favourite-symbol" />
            </StackLayout>
        </v-template>
    </ListView>
</template>

<script>
    export default {
        props: {
            onTap: {
                type: Function,
                required: true
            },
            items: {
                type: Array,
                required: true
            }
        },
        methods: {
            fixLV() {
                this.$refs.favouritesList.nativeView.android.setVerticalScrollBarEnabled(false);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .favourite-symbol {
        font-size: 18px;
    }
</style>
