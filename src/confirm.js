const appKey = '14d27ba2a1d4d5160e8eaab9c3cfcf2f'

let t = window.TrelloPowerUp.iframe({
  appKey: appKey,
  appName: 'Memo-to-Trello',
})

t.render(function () {
  let args = t.args()

  document
  .getElementById('confirm-box')
  .innerHTML(`<p>Added <strong>${args.cards.length}</strong> cards to <strong>${args.list}</strong></p>`)

  t.sizeTo(document.body)
})
