let t = window.TrelloPowerUp.iframe({
  appKey: '14d27ba2a1d4d5160e8eaab9c3cfcf2f',
  appName: 'Memo-to-Trello'
});
t.render(() => {
  document.getElementById('signin').addEventListener('click', () => {
    t.getRestApi()
      .authorize({scope: 'read, write'})
      .then(t => {
        console.log(t);
        return t.modal({
          title: 'Memo-to-Trello',
          fullscreen: true,
          url: './modal.html'
        })
      }, false)
      .catch(e => {
        console.error(e);
        t.closePopup();
      })
  })
})
