let t = window.TrelloPowerUp.iframe();
t.render(() => {
  document.getElementById('signin').addEventListener('click', () => {
    t.getRestApi()
      .authorize({scope: 'read, write'})
      .then(t => {
        console.log(t);
      }, false)
  })
})
