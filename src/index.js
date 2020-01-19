var onBtnClick = function (t, opts) {
  return t.getRestApi()
    .isAuthorized()
    .then(function(isAuth) {
      if (!isAuth) {
        return t.popup({
          title: 'Authorize Memo-to-Trello?',
          url: './login.html'
        })
      } else {
        let now = new Date()
        console.log(`Index.js - opening modal - ${now}`)
        return t.modal({
          title: 'Memo-to-Trello',
          fullscreen: true,
          url: './modal.html'
        })
      }
    })
    .catch(TrelloPowerUp.restApiError.AuthDeniedError, e => {
      console.log('Authorization cancelled')
    })
    .catch(e => {
      console.error(e)
    })
}

window.TrelloPowerUp.initialize({
  'board-buttons': function (t, opts) {
    return [{
      text: 'Memo-to-Trello',
      callback: onBtnClick,
      condition: 'edit'
    }]
  }
}, {
  appKey: '14d27ba2a1d4d5160e8eaab9c3cfcf2f',
  appName: 'Memo-to-Trello'
})