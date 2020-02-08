import Vue from 'vue'
import _ from 'lodash'
import axios from 'axios'
import Card from './Card.vue'
import Member from './Member.vue'
import Label from './Label.vue'

const appKey = '14d27ba2a1d4d5160e8eaab9c3cfcf2f'

let t = window.TrelloPowerUp.iframe({
  appKey: appKey,
  appName: 'Memo-to-Trello',
})

let colors = window.TrelloPowerUp.util.colors

let vm = new Vue({
  el: '#app',
  data: {
    cards: [],
    board: {},
    boardLabels: [],
    lists: [],
    selectedList: {},
    saving: false,
    message: null,
  },
  components: {
    'trello-card': Card,
    'trello-member': Member,
    'trello-label': Label
  },
  mounted: function() {
    this.$refs.text.focus()
    return t.board('all')
      .then(board => {
        this.board = board
        this.boardLabels = this.board.labels.map(label => {
          return {
            id: label.id,
            name: label.name,
            color: colors.getHexString(label.color)
          }
        })
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
    cardCountText: function () {
      if (this.cards.length === 1) {
        return '1 card'
      } else if (this.cards.length > 1) {
        return `${this.cards.length} cards`
      } else {
        return 'No cards, yet'
      }
    },
    buttonText: function () {
      if (this.saving) {
        return 'Saving cards...'
      } else if (this.cards.length === 1) {
        return 'Create card'
      } else if (this.cards.length > 1) {
        return `Create ${this.cards.length} cards`
      } else {
        return 'Create cards'
      }
    },
    buttonDisabled: function () {
      return !(
        (this.selectedList.id || false)   // User selected a list
        && !!this.cards.length            // There are cards to save
        && !this.saving                   // Currently not saving
      )
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
      if (!this.saving) {
        this.saving = true
        this.message = null
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
          .catch(error => {
            self.saving = false
            if (error.response) {
              let err = error.response.data
              self.message = `${err.error}: ${err.message}`
            } else {
              self.message = error.message
            }
          })
      }
    }
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
  let name = !newLineIndex ? text : text.substring(0,newLineIndex).trim()
  let desc = !newLineIndex ? '' : text.substring(newLineIndex + 1).trim()

  const memberRegex = new RegExp('@([A-Z]{2}|[a-z0-9_]*)', 'g')
  let memMatch = Array.from(desc.matchAll(memberRegex), m => m[1])
  let cardMembers = members.filter(m => {
      return memMatch.includes(m.username) || memMatch.includes(m.initials)
  })

  const labelRegex = new RegExp('#(\\w+)', 'g')
  let labelMatch = Array.from(desc.matchAll(labelRegex), m => m[1])
  let cardLabels = labels.filter(l => labelMatch.includes(l.name))

  if (!!cardLabels.length) {
    // Escape # characters in labels to avoid parsing as header
    const replaceRegex = new RegExp(labelMatch.map(l => `#${l}`).join('|'), 'g')
    desc = desc.replace(replaceRegex, match => `\\${match}`)
  }

  let due = null
  const dueRegex = new RegExp('\\$due:\\s?(\\d{4}-\\d{2}-\\d{2})')
  if (desc.match(dueRegex)) {
    due = new Date(desc.match(dueRegex)[1])
  }

  return {
    name: name,
    desc: desc.length > 5 ? t.safe(desc.trim()) : '',
    members: cardMembers,
    labels: cardLabels,
    due: due,
    raw: text
  }
}
