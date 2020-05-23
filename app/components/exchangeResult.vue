<template>
    <StackLayout class="result-container form">
        <TextField
            :text="exchangeResult"
            class="result-text"
            editable="false"
            fontSize="18"
        />
    </StackLayout>
</template>

<script>
export default {
    props: {
        exchangeResult: {
            type: Number,
            required: true
        }
    }
}
</script>

<style lang="scss" scoped>
    @import "../app.scss";

    .result-container {
        background-color: $accent;
        border-radius: 50%;

        .result-text {
            text-align: center;
            vertical-align: center;
            color: black;
            border-width: 1;
            font-weight: bold;
            border-color: transparent;
        }
    }
    .result .result-text {
        border: 1px solid red;
    }
</style>
