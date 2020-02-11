import { parseInput, parseCard, parseCardName, parseMembers } from '../../src/parse'

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

describe('parseCardName', () => {
  const cases = [
    ['Card', { name: 'Card', desc: ''}],
    ['Card\n', { name: 'Card', desc: ''}],
    ['Card\nDescription', { name: 'Card', desc: 'Description'}],
    ['Card:Description', { name: 'Card', desc: 'Description' }],
    ['Card:\nDescription', { name: 'Card', desc: 'Description' }],
    ['Card\nDescription:', { name: 'Card', desc: 'Description:' }],
    ['Card\nDescription\nSecond line ', { name: 'Card', desc: 'Description\nSecond line' }],
  ]

  it.each(cases)(
    'separates card title from description',
    (text, expected) => {
      expect(parseCardName(text)).toEqual(expected)
    }
  )
})

describe('parseMembers', () => {
  const boardMembers = [
    {username: 'username', initials: 'UN'},
    {username: 'otheruser', initials: 'OU'},
  ]

  const negatives = [
    'Text@OUtext',
    'otheruser',
    '@ otheruser',
    '@OU@UN',
    '@@username',
  ]

  it('should find member', () => {
    const text = '@username'
    let members = parseMembers(text, boardMembers)
    expect(members.length).toBe(1)
    expect(members[0].username).toBe('username')
  })
  it('should find member', () => {
    const text = '@username text'
    let members = parseMembers(text, boardMembers)
    expect(members.length).toBe(1)
    expect(members[0].username).toBe('username')
  })

  it.only('should find member', () => {
    const text = 'Text @UN @OU text'
    let members = parseMembers(text, boardMembers)
    expect(members.length).toBe(2)
    expect(members[0].username).toBe('username')
    expect(members[1].username).toBe('otheruser')
  })

  it('should find member', () => {
    const text = 'Text\n@UN @OU\ntext'
    let members = parseMembers(text, boardMembers)
    expect(members.length).toBe(2)
    expect(members[0].username).toBe('username')
    expect(members[1].username).toBe('otheruser')
  })

  it.each(negatives)('should not find member in %p', (input) => {
    let members = parseMembers(input, boardMembers)
    expect(members.length).toBe(0)
  })
})