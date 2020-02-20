<template>
    <BottomNavigation selectedIndex="0">
        <!-- The bottom tab UI is created via TabStrip (the containier) and TabStripItem (for each tab)-->
        <TabStrip>
            <TabStripItem class="convert">
                <Label text="Convert"></Label>
                <Image src.decode="font://&#xf362;" class="fas t-36"></Image>
            </TabStripItem>
            <TabStripItem class="rates">
                <Label text="Common rates"></Label>
                <Image src.decode="font://&#xf080;" class="fas t-36"></Image>
            </TabStripItem>
            <TabStripItem class="favourite-rates">
                <Label text="Favourite rates"></Label>
                <Image src.decode="font://&#xf005;" class="fas t-36"></Image>
            </TabStripItem>
        </TabStrip>

        <!-- The number of TabContentItem components should corespond to the number of TabStripItem components -->
<!--        Convert tab with main functionality of conversion-->
        <TabContentItem class="nt-tab-content__item">
            <ConvertTab />
        </TabContentItem>

<!--        Common rates tab with a list of common rates-->
        <TabContentItem class="nt-tab-content__item">
            <CommonRatesTab />
        </TabContentItem>

<!--        Favourite rates tab with a list of favourite rates-->
        <TabContentItem class="nt-tab-content__item">
            <FavouriteRatesTab />
        </TabContentItem>

    </BottomNavigation>
</template>

<script>
    import ConvertTab from "./ConvertTab";
    import CommonRatesTab from "./CommonRatesTab";
    import FavouriteRatesTab from "./FavouriteRatesTab";

    export default {
        components: {
            ConvertTab,
            CommonRatesTab,
            FavouriteRatesTab
        }
    }
</script>

<style scoped lang="scss">
    @import '~@nativescript/theme/scss/variables/lime';

    // Custom styles
    .fas {
        @include colorize($color: accent);
    }
</style>
