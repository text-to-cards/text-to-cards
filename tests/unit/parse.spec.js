import { parseInput, parseCard, parseCardName, parseMembers, parseLabels, parseDueDate } from '../../src/parse'

describe('parseInput', () => {
  const testInput = `
Some text
::
::Card1:Description2 @username #Label $due: 2020-03-01
::Card2

Description

with newlines

@username #Label1 #Label2 $due:2020-03-01

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

    expect(cards[1]).toEqual({
      name: 'Card2',
      desc: 'Description\n\nwith newlines\n\n@username #Label1 #Label2 $due:2020-03-01',
      members: [],
      labels: [],
      due: new Date('2020-03-01'),
      raw: 'Card2\n\nDescription\n\nwith newlines\n\n@username #Label1 #Label2 $due:2020-03-01'
    })

    expect(cards[2]).toEqual({
      name: 'Card3',
      desc: '',
      members: [],
      labels: [],
      due: null,
      raw: 'Card3'
    })

    expect(cards[3]).toEqual({
      name: 'Card4',
      desc: 'description$due:2020-01-31  #Label1@username',
      members: [],
      labels: [],
      due: null,
      raw: 'Card4:description$due:2020-01-31  #Label1@username'
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

  it('should find member', () => {
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

  it.each(negatives)(
    'should not find member in %p',
    (input) => {
      let members = parseMembers(input, boardMembers)
      expect(members.length).toBe(0)
    }
  )
})

describe('parseLabels', () => {
  const boardLabels = [
    { name: 'Label1', id: 1 },
    { name: 'Label2', id: 2 },
  ]

  const positives = [
    ['#Label1', 1],
    ['Text #Label1 text', 1],
    ['Text\n#Label1\ntext', 1],
    ['Text #Label1 #Label2 text', 2],
    ['Text\n#Label1\n#Label2\ntext', 2],
    ['Text\n\n #Label1\n #Label2 \ntext', 2],
  ]

  const negatives = [
    '# Label1',
    '#Label1#Label2',
    ' #Label1#Label2',
    '#Label',
    '##Label1',
  ]

  it.each(positives)(
    'should find labels in %p',
    (input, expected) => {
      let labels = parseLabels(input, boardLabels)
      expect(labels.length).toBe(expected)
    }
  )

  it.each(negatives)(
    'should not find labels in %p',
    (input) => {
      let labels = parseLabels(input, boardLabels)
      expect(labels.length).toBe(0)
    }
  )
})

describe('parseDueDate', () => {
  const positives = [
    '$due: 2020-01-31',
    '$due:2020-01-31',
    ' $due:2020-01-31',
    'Text $due:2020-01-31 text',
    'Text\n$due:2020-01-31',
    'Text\n$due:2020-01-31 $due: 2020-02-28',
  ]

  const negatives = [
    '$ due: 2020-01-31',
    '$due: 2020-31-01',
    '$ due: 12-31-2020',
    '$due 2020-01-31',
    '$due2020-01-31',
    '$due: 2020-01-32',
    'Text$due: 2020-01-31',
    '$due: 2020-01-31Text',
    '$due:\n2020-01-31'
  ]

  it.each(positives)(
    'should find due date in %p',
    (input) => {
      let due = parseDueDate(input)
      expect(due).toEqual(new Date('2020-01-31'))
    }
  )

  it.each(negatives)(
    'should not find due date in %p',
    (input) => {
      let due = parseDueDate(input)
      expect(due).toEqual(null)
    }
  )
})