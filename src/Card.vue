<template lang='pug'>
    div.card-container(ref='container')
</template>>

<script>
export default {
    props: ['card'],
    mounted() {
        this.card.url = "https://trello.com/c/preview/no-card"
        this.card.badges = {
            due: !!this.card.due ? this.card.due.toISOString() : null,
            description: !!this.card.desc.length,
        }
        let cardEl = document.createElement('trello-card')
        cardEl.card = this.card
        this.$refs.container.append(cardEl)
    }
}
</script>

<style scoped>
    .card-container {
        margin: 6px 3px 3px 3px;
        pointer-events: none;
    }
</style>
