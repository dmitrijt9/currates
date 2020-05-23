<template>
<Page @loaded="appLoaded">
    <ActionBar title="Favourites">
        <!--        <ActionItem-->
        <!--            ios.systemIcon="13" ios.position="right"-->
        <!--            android.systemIcon="ic_notification" android.position="actionBar"-->
        <!--        />-->
    </ActionBar>
    <StackLayout v-if="!favourites || favourites.length <= 0" width="100%">
        <FlexboxLayout height="100%" padding="70" flexDirection="column">
            <Image src.decode="font://&#xf089;" stretch="none" class="fas t-36" alignSelf="center"/>
            <Label text="No favourite items yet." class="h3 text-center" margin="20" />
        </FlexboxLayout>
    </StackLayout>
    <AbsoluteLayout ref="rootLayout">
        <FavouritesList :items="favourites" :on-tap="handleFavouriteTap" />

        <StackLayout left="0" top="0" height="100%" width="100%" class="backdrop" :class="classBackdrop" />

        <exchange-pair
                v-if="fabActive"
                v-model="selectedCurrencies"
                class="exchange-pair-dialog"
                :class="classExchangePair"
        />
<!--        <AbsoluteLayout class="save-button-container" v-if="fabActive" marginTop="71%" marginLeft="76%">-->
        <AbsoluteLayout class="save-button-container" v-if="fabActive">
            <Button
                @tap="saveFavourite"
                text.decode="&#xf004;"
                class="fas t-18 saveButton"
                color="#4ebaaa"
                backgroundColor="white"
                top="8"
                left="8"
            />
        </AbsoluteLayout>
<!--        <AbsoluteLayout class="fab-container" ref="fabItemPosition" marginTop="82%" marginLeft="75%">-->
        <AbsoluteLayout class="fab-container" ref="fabItemPosition">
            <fab-button
                @tap="fabActive = !fabActive"
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
    import ExchangePair from "~/components/exchangePair";

    const app = require("tns-core-modules/application");
    const platform = require("tns-core-modules/platform");

    export default {
        components: {ExchangePair, FabButton, FavouritesList},
        data() {
            return {
                fabActive: false,
                selectedCurrencies: {
                    base: 'EUR',
                    target: 'CZK'
                }
            }
        },
        computed: {
            favourites() {
                return this.$store.state.favourites ? this.$store.state.favourites : []
            },
            classBackdrop() {
                return this.fabActive ? "backdrop-visible" :
                    "backdrop-invisible";
            },
            classExchangePair() {
                return this.fabActive ? "raisePair" : "downPair";
            }
        },
        methods: {
            appLoaded(args) {
                // let rootLayout = this.$refs.rootLayout.nativeView;
                //
                // // Needed to avoid masking child components on Android
                // if (app.android && platform.device.sdkVersion >= "21") {
                //     rootLayout.android.setClipChildren(false);
                // }
            },
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
            saveFavourite() {
                confirm({
                    title: "Add to favorites?",
                    message: `Add ${this.selectedCurrencies.base} -> ${this.selectedCurrencies.target} to favourites?`,
                    okButtonText: "Yes",
                    cancelButtonText: "No",
                    neutralButtonText: 'Cancel'
                }).then(async (result) => {
                    // result argument is boolean
                    if (result) {
                        await this.$store.dispatch('addToFavourites', {...this.selectedCurrencies})
                        await this.$store.dispatch('loadFavouritesFromDb')
                        this.$toast.makeText(`${this.selectedCurrencies.base} -> ${this.selectedCurrencies.target} added to favourites`).show()
                    }
                });
                this.fabActive = false
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "../app.scss";

    .exchange-pair-dialog {
        background-color: rgba(255, 255, 255, 1);
        color: black;
        width: 100%;
        margin-top: 50%;
    }

    .backdrop {
        z-index: 0;
        background-color: rgba(29, 30, 35, .90);
    }

    .backdrop-visible {
        animation-name: activateBackdrop;
        animation-duration: .25s;
        animation-fill-mode: forwards;
    }

    .backdrop-invisible {
        animation-name: activateBackdrop;
        animation-duration: .25s;
        animation-fill-mode: forwards;
        animation-direction: reverse;
    }

    .raiseItem1 {
        opacity: 1;
        animation-name: raiseItem1;
        animation-duration: .25s;
        animation-timing-function: cubic-bezier(0.165, 0.840, 0.440, 1.000);
        animation-fill-mode: forwards;
    }

    .downItem1 {
        animation-name: raiseItem1;
        animation-duration: .20s;
        animation-timing-function: cubic-bezier(0.895, 0.030, 0.685, 0.220);
        animation-fill-mode: forwards;
        animation-direction: reverse;
    }

    .raisePair {
        opacity: 1;
        animation-name: raisePair;
        animation-duration: .25s;
        animation-timing-function: cubic-bezier(0.165, 0.840, 0.440, 1.000);
        animation-fill-mode: forwards;
    }

    .downPair {
        animation-name: raisePair;
        animation-duration: .20s;
        animation-timing-function: cubic-bezier(0.895, 0.030, 0.685, 0.220);
        animation-fill-mode: forwards;
        animation-direction: reverse;
    }

    @keyframes raisePair {
        from {
            opacity: 1;
            transform: translate(0, 0);
        }

        to {
            opacity: 1;
            transform: translate(0, -100);
        }
    }

    @keyframes raiseItem1 {
        from {
            opacity: 1;
            transform: translate(0, 0);
        }

        to {
            opacity: 1;
            transform: translate(0, -30);
        }
    }

    @keyframes activateBackdrop {
        from {
            opacity: 0;
        }

        to {
            opacity: 1;
        }
    }

    .saveButton {
        width: 120px;
        height: 120px;
        background-color: $accent;
        border-radius: 100%;
    }

    .fab-container {
        margin-top: 82%;
        margin-left: 75%;
    }
    .save-button-container {
        margin-top: 72%;
        margin-left: 76%;
    }
</style>
