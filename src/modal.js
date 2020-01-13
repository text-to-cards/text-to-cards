import Vue from 'vue'

let t = window.TrelloPowerUp.iframe({
  appKey: '14d27ba2a1d4d5160e8eaab9c3cfcf2f',
  appName: 'Memo-to-Trello',
})

let vm = new Vue({
  el: '#app',
  data: {
    cards: [],
    board: {}
  },
  created: function() {
    return t.board('all')
      .then(board => {
        this.board = board
      })
      .catch(e => {
        console.error(e)
      })
  },
  methods: {
    parseInput: function (e) {
      this.cards = parseInput(
        e.target.value,
        this.board.members,
        this.board.labels
      )
    }
  }
})

function parseInput(text, members) {
  const cardSplitter = /:{2}/gm
  return text
    .split(cardSplitter)
    .map((elem, index, array) => {
      if (index > 0) { // first elem will be either empty or non-card content
        return parseCard(elem.trim(), members, labels)
      }
    })
}

function parseCard(text, members, labels) {
  let newLineIndex = text.indexOf('\n')
  let name = newLineIndex === -1 ? text : text.substring(0,newLineIndex).trim()
  let desc = newLineIndex === -1 ? '' : text.substring(newLineIndex).trim()

  const memberRegex = new RegExp('\s|\n@([A-Z]{2}|[a-z]*)', 'g')
  let memMatch = Array.from(desc.matchAll(memberRegex), m => m[0])
  let cardMembers = members
    .filter(m => {
      return memMatch.includes(m.username) || memMatch.includes(m.initials)
    })
    .map(m => m.id)

  const labelRegex = new RegExp('\s|\n#([^\s]*)', 'g')
  let labelMatch = Array.from(desc.matchAll(labelRegex), m => m[0])
  let cardLabels = labels
    .filter(l => labelMatch.includes(l.name))
    .map(l => l.id)

  let processedDesc = desc.replace(memberRegex, '').replace(labelRegex, '')

  return {
    name: name,
    desc: desc.length > 5 ? processedDesc : '',
    idMembers: cardMembers,
    idLabels: cardLabels,
    due: null
  }
}