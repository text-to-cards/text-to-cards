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

  let newLineIndex = text.match(/:|\n/)? text.match(/:|\n/).index : false
  let name = !newLineIndex ? text : text.substring(0,newLineIndex).trim()
  let desc = !newLineIndex ? '' : text.substring(newLineIndex + 1).trim()

  const memberRegex = new RegExp('@([A-Z]{2}|[a-z0-9_]*)', 'g')
  let memMatch = Array.from(desc.matchAll(memberRegex), m => m[1])
  let cardMembers = members.filter(m => {
      return memMatch.includes(m.username) || memMatch.includes(m.initials)
  })

  const labelRegex = new RegExp('#(\\w+)', 'g')
  let labelMatch = Array.from(desc.matchAll(labelRegex), m => m[1])
  let cardLabels = labels.filter(l => labelMatch.includes(l.name))

  if (!!cardLabels.length) {
    // Escape # characters in labels to avoid parsing as header
    const replaceRegex = new RegExp(labelMatch.map(l => `#${l}`).join('|'), 'g')
    desc = desc.replace(replaceRegex, match => `\\${match}`)
  }

  let due = null
  const dueRegex = new RegExp('\\$due:\\s?(\\d{4}-\\d{2}-\\d{2})')
  if (desc.match(dueRegex)) {
    due = new Date(desc.match(dueRegex)[1])
  }

  return {
    name: name,
    desc: desc.length > 5 ? desc.trim() : '',
    members: cardMembers,
    labels: cardLabels,
    due: due,
    raw: text
  }
}
