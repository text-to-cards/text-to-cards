import Vue from 'vue'

let t = window.TrelloPowerUp.iframe({
  appKey: '14d27ba2a1d4d5160e8eaab9c3cfcf2f',
  appName: 'Memo-to-Trello'
})

let vm = new Vue({
  el: '#app',
  data: {
    cards: [],
    t: t
  },
  methods: {
    parseInput: function (e) {
      this.cards = parseInput(e.target.value)
    }
  },
  computed: {
    members: function () {
      const context = this.t.getContext()
      return this.t.board(context.board, 'members')
    }
  }
})

function parseInput(text) {
  const cardSplitter = /:{2}/gm
  return text
    .split(cardSplitter)
    .map((elem, index, array) => {
      if (index > 0) {
        return parseCard(elem.trim())
      }
    })
}

function parseCard(text) {
  let newLineIndex = text.indexOf('\n')
  let name = newLineIndex === -1 ? text : text.substring(0,newLineIndex).trim()
  let desc = newLineIndex === -1 ? '' : text.substring(newLineIndex).trim()

  return {
    name: name,
    desc: desc.length > 5 ? desc : ''
  }
}