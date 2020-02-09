import * as Sentry from '@sentry/browser'

Sentry.init({ dsn: 'https://62073e6e92b444309fe05ea19e14e7a8@sentry.io/2388790' })


var t = window.TrelloPowerUp.iframe({
  appKey: '14d27ba2a1d4d5160e8eaab9c3cfcf2f',
  appName: 'Memo-to-Trello'
})

t.render(function() {
  t.sizeTo(document.body)
  document.querySelector('button').addEventListener('click', function() {
    t.getRestApi()
      .authorize({ scope: 'read,write' })
      .then(function(token) {
        t.closePopup()
        return t.modal({
          title: 'Memo-to-Trello',
          fullscreen: true,
          url: './modal.html'
        })
      })
  }, false)
})