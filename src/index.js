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
      return t.popup({
        type: 'confirm',
        title: 'Sign-in with Trello',
        message: 'Authorize Memo-to-Trello with your Trello account',
        confirmText: 'Authorize',
        onConfirm: function(t, opts) {
          return t.modal({
            title: 'Memo-to-Trello',
            fullscreen: true,
            url: './modal.html'
          })
        }
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