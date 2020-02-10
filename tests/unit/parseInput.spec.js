import { parseInput, parseCard } from '@/parse'

describe('parseInput', () => {
  it('creates cards from input text', () => {
    const text = '::Card\nDescription'
    let cards = parseInput(text, [], [])
    expect(cards.length).toEqual(1)
  })
})

describe('parseCard', () => {
  it('parses one card from input text', () => {
    const text = 'Card\nDescription\n'
    let card = parseCard(text, [], [])
    expect(card.name).toMatch('Card')
  })
})