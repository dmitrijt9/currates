<template>
<Page>
    <ActionBar title="Favourites">
        <ActionItem
            ios.systemIcon="13" ios.position="right"
            android.systemIcon="ic_popup_sync" android.position="actionBar"
        />
    </ActionBar>
    <StackLayout v-if="!favourites">
        <Label text="Favourites" class="h1 text-center p-16"></Label>
        <FlexboxLayout height="100%" padding="70" flexDirection="column">
            <Image src.decode="font://&#xf089;" stretch="none" class="fas t-36" alignSelf="center"/>
            <Label text="No favourite items yet." class="h3 text-center" margin="20" />
        </FlexboxLayout>
    </StackLayout>
    <FavouritesList ref="favouritesList" :items="favourites" :on-tap="handleFavouriteTap" />
</Page>
</template>

<script>
    import FavouritesList from "~/components/favouritesList";
    export default {
        components: {FavouritesList},
        computed: {
            favourites() {
                return this.$store.state.favourites
            }
        },
        methods: {
            handleFavouriteTap({ item }) {
                action(`Select action for ${item.base} -> ${item.target}`, "Close", ["Remove"])
                    .then(async (result) => {
                        if (result === 'Remove') {
                            await this.$store.dispatch('deleteFavourite', item.id)
                            await this.$store.dispatch('loadFavouritesFromDb')
                        }
                    });
            }
        }
    }
</script>
