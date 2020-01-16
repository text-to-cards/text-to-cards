<template lang='pug'>
    div.card-container
        div(v-if='!!card.labels.length')
            span.label(v-bind:style='{ background: label.color_hex}' v-for='label in card.labels') {{ label.name }}
        div.title {{ card.name }}
        div.members(v-if='!!card.members.length')
            img.avatar(width=30 height=30 v-for='member in card.members' v-bind:src='member.avatar')
        div.due {{ card.due }}
</template>>

<script>
export default {
    props: ['card']
}
</script>

<style scoped>
    .card-container {
        width: 256px;
        display: block;
        border-radius: 3px;
        background: #fff;
        padding: 6px 8px 0px 8px;
        font-family: Segoe UI,Roboto,Noto Sans,Ubuntu,Droid Sans,Helvetica Neue,sans-serif;
        font-size: 14px;
        font-weight: 400;
        line-height: 20px;
        box-shadow: 0 1px 0 rgba(9,30,66,.25);
        margin: 6px 3px 3px 3px;
    }

    .title {
        color: #172b4d;
        margin: 2px 0px 2px 0px;
    }

    .labels {
        min-width: 40px;
    }

    .label {
        height: 16px;
        line-height: 16px;
        max-width: 198px;
        font-size: 12px;
        font-weight: 700;
        margin: 0 4px 4px 0;
        padding: 0px 8px;
        color: #fff;
        border-radius: 4px;
        min-width: 40px;
        -webkit-font-smoothing: antialiased;
    }

    .members {
        display: inline-block;
        width: 100%;
    }

    .avatar {
        border-radius: 14px;
        width: 28px;
        height: 28px;
        float: right;
        margin: 0 0 4px 4px;
        display: block;
        position: relative;
    }
</style>