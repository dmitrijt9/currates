<template>
    <StackLayout class="fab-button" @tap="$emit('tap')">
        <GridLayout rows="2, auto" horizontalAlignment="center" class="fab-icon" :class="buttonAnimation">
            <Label row="1" class="fab-dash--1" />
            <Label row="1" class="fab-dash--2" />
        </GridLayout>
    </StackLayout>
</template>


<script>
    export default {
        props: {
            isActive: Boolean
        },
        computed: {
            buttonAnimation() {
                return this.isActive ? "iconActive" : "iconIdle"
            }
        }
    }

</script>

<style scoped lang="scss">
    @import "../app.scss";

    .fab-button {
        width: 200px;
        height: 200px;
        background-color: $complementary;
        border-radius: 100%;
        vertical-align: center;
    }

    .fab-icon {
        height: 54px;
        width: 54px;
    }

    .fab-dash--1,
    .fab-dash--2 {
        background-color: #fff;
        transform: translate(0, -2);
        height: 54px;
        width: 14px;
    }

    .fab-dash--1 {
        transform: rotate(90deg) translate(0, -2);
    }

    .iconActive {
        animation-name: iconActive;
        animation-duration: 0.25s;
        animation-timing-function: cubic-bezier(0.165, 0.840, 0.440, 1.000);
        animation-fill-mode: forwards;
    }

    .iconIdle {
        animation-name: iconActive;
        animation-duration: 0.25s;
        animation-timing-function: ease-out;
        animation-fill-mode: forwards;
        animation-direction: reverse;
    }

    @keyframes iconActive {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(225deg);
        }
    }
</style>
