<template>
    <StackLayout class="result-container form">
        <TextField
            :text="conversionResult"
            class="result-text"
            editable="false"
            fontSize="24"
        />
    </StackLayout>
</template>

<script>
export default {
    props: {
        conversionResult: {
            type: String,
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
            border-width: 1;
            border-color: transparent;
        }
    }
    .result .result-text {
        border: 1px solid red;
    }
</style>