const appKey = '14d27ba2a1d4d5160e8eaab9c3cfcf2f'

let t = window.TrelloPowerUp.iframe({
  appKey: appKey,
  appName: 'Memo-to-Trello',
})
console.log('Confirmation')
t.render(function () {
  let cards = t.arg('cards')
  let list = t.arg('list')

  document.getElementById('confirm-box').innerHTML = `<p>Added <strong>${cards.length}</strong> cards to <strong>${list}</strong></p>`

  t.sizeTo(document.body)

  setTimeout(function () {
    t.closePopup()
  }, 3000)
})
