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
      console.log(t.getContext())
      return t.popup({
        type: 'confirm',
        title: 'Authorize with Trello',
        message: 'Authorize Memo-to-Trello with your Trello account',
        confirmText: 'Authorize',
        // onConfirm: function(t, opts) {
        //   t.getRestApi()
        //     .authorize({scope: 'read, write'})
        //     .then(t => {
        //       console.log(t);
        //       return t.modal({
        //         title: 'Memo-to-Trello',
        //         fullscreen: true,
        //         url: './modal.html'
        //       })
        //   }, false)
        }
      })
    }
  })
  .catch(e => {
    console.error(e)
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