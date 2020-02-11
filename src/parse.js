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
  const memberRegex = new RegExp('@([A-Z]{2}|[a-z0-9_]*)', 'g')
  let memMatch = Array.from(desc.matchAll(memberRegex), m => m[1])
  let cardMembers = members.filter(m => {
      return memMatch.includes(m.username) || memMatch.includes(m.initials)
  })

  return cardMembers
}

export function parseLabels(desc, labels) {
  const labelRegex = new RegExp('#(\\w+)', 'g')
  let labelMatch = Array.from(desc.matchAll(labelRegex), m => m[1])
  let cardLabels = labels.filter(l => labelMatch.includes(l.name))

  return cardLabels
}

export function parseDueDate(desc) {
  const dueRegex = new RegExp('\\$due:\\s?(\\d{4}-\\d{2}-\\d{2})')
  if (desc.match(dueRegex)) {
    return new Date(desc.match(dueRegex)[1])
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
