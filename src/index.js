var onBtnClick = function (t, opts) {
  console.log(opts);
  t.modal({
    title: 'Memo-to-Trello',
    fullscreen: true,
    url: './modal.html'
  })
};

window.TrelloPowerUp.initialize({
  'board-buttons': function (t, opts) {
    return [{
      // icon: {
      //   dark: WHITE_ICON,
      //   light: BLACK_ICON
      // },
      text: 'Memo-to-Trello',
      callback: onBtnClick,
      condition: 'edit'
    }];
  }
});