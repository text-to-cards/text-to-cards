import Vue from 'vue'
import _ from 'lodash'
import axios from 'axios'
import Card from './Card.vue'

const appKey = '14d27ba2a1d4d5160e8eaab9c3cfcf2f'

let now = new Date()
console.log(`Modal.js - start - ${now}`)

let t = window.TrelloPowerUp.iframe({
  appKey: appKey,
  appName: 'Memo-to-Trello',
})

now = new Date()
console.log(`Modal.js - Loaded TrelloPowerup - ${now}`)

let colors = window.TrelloPowerUp.util.colors

let vm = new Vue({
  el: '#app',
  data: {
    cards: [],
    board: {},
    lists: [],
    selectedList: {},
    message: null
  },
  components: {
    'trello-card': Card
  },
  mounted: function() {
    let now = new Date()
    console.log(`Modal.js - mounted() start - ${now}`)

    this.$refs.text.focus()
    return t.board('all')
      .then(board => {
        this.board = board
        return t.lists('id', 'name')
      })
      .then(lists => {
        this.lists = lists
        now = new Date()
        console.log(`Modal.js - mounted() end - ${now}`)
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
    },
    buttonDisabled: function () {
      return !((this.selectedList.id || false) && !!this.cards.length)
    }
  },
  methods: {
    parseInput: _.debounce(function (e) {
      this.cards = parseInput(
        e.target.value,
        this.board.members,
        this.board.labels
      )
    }, 300),
    createCards: function (e) {
      let self = this
      let cards = this.cards
      return t.getRestApi()
        .getToken()
        .then(token => {
          return Promise.all(cards.map(card => {
            return axios.post('https://api.trello.com/1/cards', {
              name: card.name,
              desc: card.desc,
              idMembers: card.members.map(m => m.id),
              idLabels: card.labels.map(l => l.id),
              idList: card.idList,
              due: card.due,
              token: token,
              key: appKey,
              pos: 'top'
            })
          }))
        })
        .then(response => {
          t.closeModal()
        })
        .catch(e => console.error(e))
    },
  },
  watch: {
    selectedList: function (newList) {
      this.cards.forEach(c => {
        c.idList = newList.id
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

  let newLineIndex = text.match(/:|\n/)? text.match(/:|\n/).index : false
  console.log(newLineIndex)
  let name = !newLineIndex ? text : text.substring(0,newLineIndex).trim()
  let desc = !newLineIndex ? '' : text.substring(newLineIndex + 1).trim()

  const memberRegex = new RegExp('@([A-Z]{2}|[a-z0-9_]*)', 'g')
  let memMatch = Array.from(desc.matchAll(memberRegex), m => m[1])
  let cardMembers = members.filter(m => {
      return memMatch.includes(m.username) || memMatch.includes(m.initials)
  })

  const labelRegex = new RegExp('#(\\w+)', 'g')
  let labelMatch = Array.from(desc.matchAll(labelRegex), m => m[1])
  let cardLabels = labels
    .filter(l => labelMatch.includes(l.name))
    .map(l => {
      l.color_hex = colors.getHexString(l.color)
      return l
    })

  let due = null
  const dueRegex = new RegExp('\\$due:\\s?(\\d{4}-\\d{2}-\\d{2})')
  if (desc.match(dueRegex)) {
    due = new Date(desc.match(dueRegex)[1])
  }

  // Escape # characters to avoid markdown parsing
  labelMatch.forEach(l => {
    desc = desc.replace('#' + l.name, '\\#' + l.name)
  })

  return {
    name: name,
    desc: desc.length > 5 ? t.safe(desc.trim()) : '',
    members: cardMembers,
    labels: cardLabels,
    due: due,
    raw: text
  }
}
