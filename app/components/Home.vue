<template>
    <Page :actionBarHidden="false">
        <BottomNavigation />
    </Page>
</template>

<script>
    import BottomNavigation from "./BottomNavigation";
    export default {
        components: {
            BottomNavigation
        }
    };
</script>
