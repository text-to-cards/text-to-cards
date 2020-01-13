import Vue from 'vue'

let t = window.TrelloPowerUp.iframe({
  appKey: '14d27ba2a1d4d5160e8eaab9c3cfcf2f',
  appName: 'Memo-to-Trello',
})

let vm = new Vue({
  el: '#app',
  data: {
    cards: [],
    board: {},
    lists: [],
    selectedList: {}
  },
  mounted: function() {
    return t.board('all')
      .then(board => {
        this.board = board
        return t.lists('id', 'name')
      })
      .then(lists => {
        this.lists = lists
      })
      .catch(e => {
        console.error(e)
      })
  },
  computed: {
    buttonText: function() {
      if (this.cards.length === 1) {
        return 'Create card'
      } else if (this.cards.length > 1) {
        return `Create ${this.cards.length} cards`
      } else {
        return 'Create cards'
      }
    }
  },
  methods: {
    parseInput: function (e) {
      this.cards = parseInput(
        e.target.value,
        this.board.members,
        this.board.labels
      )
    },
    createCards: function () {
      let that = this
      this.cards
        .map(c => {
          c['idList'] = that.list.id
          return c
        })
        .forEach(c => {
          // Upload cards
        })
    }
  }
})

function parseInput(text, members, labels) {
  const cardSplitter = /:{2}/gm
  return text
    .split(cardSplitter)
    .slice(1) // first element is empty or non-card related
    .map((elem, index, array) => parseCard(elem.trim(), members, labels))
    .filter(c => c.name.length)
}

function parseCard(text, members, labels) {
  members = members || []
  labels = labels || []

  let newLineIndex = text.indexOf('\n')
  let name = newLineIndex === -1 ? text : text.substring(0,newLineIndex).trim()
  let desc = newLineIndex === -1 ? '' : text.substring(newLineIndex).trim()

  const memberRegex = new RegExp('@([A-Z]{2}|[a-z 0-9 _]*)', 'g')
  let memMatch = Array.from(desc.matchAll(memberRegex), m => m[1])
  let cardMembers = members
    .filter(m => {
      return memMatch.includes(m.username) || memMatch.includes(m.initials)
    })
    .map(m => m.id)

  const labelRegex = new RegExp('#(\\w+)', 'g')
  let labelMatch = Array.from(desc.matchAll(labelRegex), m => m[1])
  let cardLabels = labels
    .filter(l => labelMatch.includes(l.name))
    .map(l => l.id)

  return {
    name: name,
    desc: desc.length > 5 ? desc : '',
    idMembers: cardMembers,
    idLabels: cardLabels,
    due: null
  }
}