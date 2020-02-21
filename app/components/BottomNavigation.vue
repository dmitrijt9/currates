<template>
    <TabView :selectedIndex="selectedTab" androidTabsPosition="bottom" tabTextColor="white">
        <TabViewItem title.decode="&#xf153;" class="fas t-36">
            <ConvertTab />
        </TabViewItem>
        <TabViewItem title.decode="&#xf080;" class="fas t-36">
            <CommonRatesTab />
        </TabViewItem>
        <TabViewItem title.decode="&#xf005;" class="fas t-36">
            <FavouriteRatesTab />
        </TabViewItem>

    </TabView>
</template>

<script>
    import ConvertTab from "./ConvertTab";
    import CommonRatesTab from "./CommonRatesTab";
    import FavouriteRatesTab from "./FavouriteRatesTab";

    export default {
        data() {
          return {
              selectedTab: 0
          }
        },
        components: {
            ConvertTab,
            CommonRatesTab,
            FavouriteRatesTab
        }
    }
</script>
