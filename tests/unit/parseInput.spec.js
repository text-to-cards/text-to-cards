import { parseInput, parseCard } from '@/parse'

  describe('parseInput', () => {
    const testInput = `
      Some text
      ::
      ::Card1:Description2 @username #Label $due: 2020-03-01
      ::Card2

      Description

      with newlines

      @username #Label1 #Label2 $due:2012-12-31

      ::Card3::Card4:description$due:2020-01-31  #Label1@username
    `

  it('creates cards from input text', () => {
    let cards = parseInput(testInput, [], [])
    expect(cards.length).toEqual(4)
    expect(cards[0]).toEqual({
      name: 'Card1',
      desc: 'Description2 @username #Label $due: 2020-03-01',
      members: [],
      labels: [],
      due: new Date('2020-03-01'),
      raw: 'Card1:Description2 @username #Label $due: 2020-03-01'
    })
  })
})
