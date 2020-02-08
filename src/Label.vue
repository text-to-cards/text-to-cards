<template lang="pug">
    div.container(v-bind:style="{background: color}")
        span.label {{ name }}
</template>

<script>
export default {
    props: ['name', 'color']
}
</script>>

<style scoped>
    .container {
        margin: 3px;
        height: 16px;
        border-radius: 4px;
        padding: 0 8px;
        min-width: 40px;
    }

    .label {
        position: relative;
        float: left;
        font-size: 12px;
        font-weight: 700;
        line-height: 16px;
        margin: 0 4px 4px 0;
        color: white;
        -webkit-font-smoothing: antialiased;
    }
</style>