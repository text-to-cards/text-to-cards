import * as Sentry from '@sentry/browser'

Sentry.init({
  dsn: 'https://62073e6e92b444309fe05ea19e14e7a8@sentry.io/2388790',
  environment: process.env.NODE_ENV
})

var onBtnClick = function (t, opts) {
  return t.getRestApi()
    .isAuthorized()
    .then(function(isAuth) {
      if (!isAuth) {
        return t.popup({
          title: 'Authorize Text to Cards?',
          url: './login.html'
        })
      } else {
        return t.modal({
          title: 'Text to Cards',
          fullscreen: true,
          url: './modal.html'
        })
      }
    })
    .catch(window.TrelloPowerUp.restApiError.AuthDeniedError, e => {
      console.log('Authorization cancelled')
    })
    .catch(e => {
      console.error(e)
    })
}

window.TrelloPowerUp.initialize({
  'board-buttons': function (t, opts) {
    return [{
      icon:{
        light: 'https://text-to-cards.netlify.com/text_to_cards_light.svg',
        dark: 'https://text-to-cards.netlify.com/text_to_cards_dark.svg'
      },
      text: 'Text to Cards',
      callback: onBtnClick,
      condition: 'edit'
    }]
  },
  'authorization-status': function(t, opts){
    return t.getRestApi()
    .isAuthorized()
    .then(function(isAuth) {
      return { authorized: isAuth }
    })
    .catch(e => {
      console.error(e)
    })
  },
  'show-authorization': function(t, options){
    return t.popup({
      title: 'Authorize Text to Cards?',
      url: './login.html'
    })
  }
}, {
  appKey: '14d27ba2a1d4d5160e8eaab9c3cfcf2f',
  appName: 'Text to Cards'
})