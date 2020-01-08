var onBtnClick = function (t, opts) {

  t.getRestApi()
  .isAuthorized()
  .then(isAuth => {
    if (isAuth) {
      return t.modal({
        title: 'Memo-to-Trello',
        fullscreen: true,
        url: './modal.html'
      })
    } else {
      return t.modal({
        title: 'Sign-in with Trello',
        fullscreen: false,
        url: './login.html'
      })
    }
  })
};

window.TrelloPowerUp.initialize({
  'board-buttons': function (t, opts) {
    return [{
      text: 'Memo-to-Trello',
      callback: onBtnClick,
      condition: 'edit'
    }];
  }
}, {
  appKey: '14d27ba2a1d4d5160e8eaab9c3cfcf2f',
  appName: 'Memo-to-Trello'
});