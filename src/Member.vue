<template lang="pug">
    div.member-container
        img.avatar(v-bind:src='member.avatar' width=30 height=30)
        div.username @{{ member.username }} (@{{ member.initials }})
</template>

<script>
export default {
    props: ['member']
}
</script>

<style scoped>
.member-container {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    padding: 3px;
}
.avatar {
    height: 28px;
    width: 28px;
    border-radius: 25em;
    margin-right: 5px;
    object-fit: cover;
}

.username {
    color: #5e6c84;
    margin: auto 0;
}
</style>