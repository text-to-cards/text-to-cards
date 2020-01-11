var t = window.TrelloPowerUp.iframe({
  appKey: '14d27ba2a1d4d5160e8eaab9c3cfcf2f',
  appName: 'Memo-to-Trello'
})

t.render(function() {
  document.querySelector('button').addEventListener('click', function() {
    t.getRestApi()
      .authorize({ scope: 'read,write' })
      .then(function(token) {
        return t.closePopup()
      })
  }, false)
})