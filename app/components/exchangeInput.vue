<template>
<StackLayout class="form">
    <TextField
        v-model="enteredValue"
        class="-border -rounded input"
        hint="Enter value to exchange"
        editable="true"
        fontSize="24"
        keyboardType="number"
        returnKeyType="done"
    />
</StackLayout>
</template>

<script>
export default {
    data() {
        return {
            enteredValue: null
        }
    }
}
</script>

<style scoped lang="scss">
    @import "../app.scss";

    .form .input {
        border-radius: 50%;
        border-color: $accent;
    }
</style>