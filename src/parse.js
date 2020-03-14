export function parseInput (text, members, labels) {
  const cardSplitter = /:{2}/gm
  return text
    .split(cardSplitter)
    .slice(1) // first element is empty or non-card related
    .map((elem, index, array) => parseCard(elem.trim(), members, labels))
    .filter(c => c.name.length)
}

export function parseCard(text, members, labels) {
  members = members || []
  labels = labels || []

  let { name, desc } = parseCardName(text)
  let cardMembers = parseMembers(desc, members)
  let cardLabels = parseLabels(desc, labels)
  let due = parseDueDate(desc)

  return {
    name: name,
    desc: desc.length > 5 ? escapeLabels(desc, cardLabels) : '',
    members: cardMembers,
    labels: cardLabels,
    due: due,
    raw: text
  }
}

export function parseCardName(text) {
  let newLineIndex = text.match(/:|\n/)? text.match(/:|\n/).index : false
  let name = !newLineIndex ? text : text.substring(0,newLineIndex).trim()
  let desc = !newLineIndex ? '' : text.substring(newLineIndex + 1).trim()

  return { name, desc }
}

export function parseMembers(desc, members) {
  const memberRegex = new RegExp('(?:^|\\s)@([A-Z]{2}|[a-z0-9_]*)(?:\\s|$)', 'g')
  let memMatch = Array.from(
    desc
      .replace(/\s/g, '  ') // expand whitespaces for proper matching
      .matchAll(memberRegex),
    m => m[1]
  )
  let cardMembers = members.filter(m => {
      return memMatch.includes(m.username) || memMatch.includes(m.initials)
  })

  return cardMembers
}

export function parseLabels(desc, labels) {
  const labelRegex = new RegExp('(?:^|\\s)(?:#(\\w+)|#{([^{}]+)})(?:\\s|$)', 'g')
  let labelMatch = Array.from(
    desc
      .replace(/\s/g, '  ') // expand whitespaces so each label has one whitespace to "claim"
      .matchAll(labelRegex),
    m => {
      let match = m[2] || m[1]
      return match.replace(/  /g, ' ') // reverse whitespace expansion within label
    }
  )
  let cardLabels = labels.filter(l => labelMatch.includes(l.name))

  return cardLabels
}

export function parseDueDate(desc) {
  const dueRegex = new RegExp(
    '(?:^|\\s)\\$due: ?(\\d{4}-(?:0[1-9]|1[0-2])-\\d{2})(?:\\s|$)'
  )

  if (desc.match(dueRegex)) {
    let d = new Date(desc.match(dueRegex)[1])
    return !isNaN(d) ? d : null
  } else {
    return null
  }
}

export function escapeLabels(desc, cardLabels) {
  // Escape # characters in labels to avoid parsing as header
  if (!!cardLabels.length) {
    const regex = new RegExp(cardLabels.map(l => `#${l.name}`).join('|'), 'g')
    desc = desc.replace(regex, match => `\\${match}`)
  }

  return desc.trim()
}
