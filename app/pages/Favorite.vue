<template>
<Page>
    <StackLayout>
        <Label text="Favourites" class="h1 text-center p-16"></Label>
        <FlexboxLayout height="100%" padding="70" flexDirection="column">
            <Image src.decode="font://&#xf089;" stretch="none" class="fas t-36" alignSelf="center"></Image>
            <Label text="No favourite items yet." class="h3 text-center" margin="20" />
        </FlexboxLayout>
    </StackLayout>
</Page>
</template>

<script>
    export default {
        async created() {
            // await this.$store.dispatch('fetchFavourites')
        },
        computed: {
            favourites() {
                return this.$store.state.favourites ? this.$store.state.favourites.pairs : []
            }
        }
    }
</script>
