<template>
<Page>
    <ActionBar title="Favourites"></ActionBar>
    <AbsoluteLayout ref="rootLayout">
        <StackLayout v-if="!favourites || favourites.length <= 0" width="100%">
            <FlexboxLayout height="100%" padding="70" flexDirection="column">
                <Image src.decode="font://&#xf089;" stretch="none" class="fas t-36" alignSelf="center"/>
                <Label text="No favourite items yet." class="h3 text-center" margin="20" />
            </FlexboxLayout>
        </StackLayout>
        <FavouritesList :items="favourites" :on-tap="handleFavouriteTap" />
        <AbsoluteLayout class="fab-container" ref="fabItemPosition">
            <fab-button
                @tap="addToFavourites"
                :is-active="fabActive"
                top="8"
                left="8"
            />
        </AbsoluteLayout>
    </AbsoluteLayout>
</Page>
</template>

<script>
    import FavouritesList from "~/components/favouritesList";
    import FabButton from "~/components/fabButton";
    import addToFavouritesDialog from "~/components/addToFavouritesDialog";

    const app = require("tns-core-modules/application");

    export default {
        components: {FabButton, FavouritesList},
        data() {
            return {
                fabActive: false
            }
        },
        computed: {
            favourites() {
                return this.$store.state.favourites ? this.$store.state.favourites : []
            }
        },
        methods: {
            handleFavouriteTap({ item }) {
                action(`Select action for ${item.base} -> ${item.target}`, "Close", ["Remove"])
                    .then(async (result) => {
                        if (result === 'Remove') {
                            await this.$store.dispatch('deleteFavourite', item.id)
                            await this.$store.dispatch('loadFavouritesFromDb')
                            this.$toast.makeText(`${this.item.base} -> ${this.item.target} removed from favourites`).show()
                        }
                    });
            },
            async addToFavourites() {
                this.fabActive = true
                const pair = await this.$showModal(addToFavouritesDialog, {
                    fullscreen: false,
                    animated: true,
                    stretched: true
                })
                if (pair) {
                    await this.$store.dispatch('addToFavourites', { base: pair.base, target: pair.target })
                    await this.$store.dispatch('loadFavouritesFromDb')
                    this.$toast.makeText(`${pair.base} -> ${pair.target} added to favourites`).show()
                }
                this.fabActive = false
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "../app.scss";

    .fab-container {
        margin-top: 82%;
        margin-left: 75%;
    }
</style>
