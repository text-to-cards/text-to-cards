import Vue from 'vue'
import _ from 'lodash'
import axios from 'axios'
import Card from './components/Card.vue'
import Member from './components/Member.vue'
import Label from './components/Label.vue'
import * as Sentry from '@sentry/browser'
import * as Integrations from '@sentry/integrations'
import { parseInput } from './parse'
import * as typeformEmbed from '@typeform/embed'
import VueCookies from 'vue-cookies'

Vue.use(VueCookies)

Sentry.init({
  dsn: 'https://62073e6e92b444309fe05ea19e14e7a8@sentry.io/2388790',
  integrations: [new Integrations.Vue({Vue, attachProps: true})],
  environment: process.env.NODE_ENV,
})

const appKey = '14d27ba2a1d4d5160e8eaab9c3cfcf2f'

let t = window.TrelloPowerUp.iframe({
  appKey: appKey,
  appName: 'Text to Cards',
})

function get_color(color) {
  let colors = window.TrelloPowerUp.util.colors
  if (color === 'black') {
    return '#344563'
  } else if (color === null) {
    return '#b3bac5'
  } else {
    return colors.getHexString(color)
  }
}

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
    showBanner: true,
  },
  components: {
    'trello-card': Card,
    'trello-member': Member,
    'trello-label': Label
  },
  mounted: function() {
    this.$refs.text.focus()
    this.$cookies.config('365d')
    this.showBanner = !this.$cookies.get('T2CSurvey')
    return t.board('all')
      .then(board => {
        this.board = board
        this.boardLabels = this.board.labels
          .filter(label => !!label.name.length)
          .map(label => {
            return {
              id: label.id,
              name: label.name,
              color: get_color(label.color)
            }
          })

        return t.lists('id', 'name')
      })
      .then(lists => {
        this.lists = lists
      })
      .catch(e => {
        console.error(e)
        Sentry.captureException(e)
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
    buttonEnabled: function () {
      // User selected a list, added cards and we are not currently saving cards
      return !!this.selectedList.id && !!this.cards.length && !this.saving
    }
  },
  methods: {
    hideBanner: function(e) {
      if (e) {
        e.preventDefault()
      }
      this.$cookies.set('T2CSurvey', 0)
      this.showBanner = false
    },
    closeSurvey: function () {
      setTimeout(this.surveyPopup.close, 3000)
      this.hideBanner()
    },
    startSurvey: function(e) {
      e.preventDefault()
      this.surveyPopup = typeformEmbed.makePopup(
        'https://andrassomi.typeform.com/to/X586qQ',
        {
          mode: 'popup',
          onSubmit: this.closeSurvey,
        }
      )
      this.surveyPopup.open()
    },
    parseInput: _.debounce(function (e) {
      this.cards = parseInput(
        e.target.value,
        this.board.members,
        this.board.labels
      )
      this.cards.forEach(c => {
        c.name = t.safe(c.name)
        c.desc = t.safe(c.desc)
      })
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
                name: t.safe(card.name),
                desc: t.safe(card.desc),
                idMembers: card.members.map(m => m.id),
                idLabels: card.labels.map(l => l.id),
                idList: self.selectedList.id,
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
              if (!!err.error && !!err.message) {
                self.message = `${err.error}: ${err.message}`
              } else {
                self.message = err
              }
            } else {
              self.message = error.message
            }
            Sentry.captureException(error)
          })
      }
    }
  }
})
