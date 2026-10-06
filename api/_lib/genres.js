/** Normalise un tableau de genres (noms IGDB) : chaînes uniques, non vides. */
export function parseGenres(value) {
  if (!Array.isArray(value)) return []
  const seen = new Set()
  const out = []
  for (const item of value) {
    const name = String(item ?? '').trim().slice(0, 60)
    if (!name || seen.has(name)) continue
    seen.add(name)
    out.push(name)
  }
  return out
}

const IGDB_GENRE_MAP = {
  'Role-playing (RPG)': 'rpg',
  Platform: 'platformer',
  Shooter: 'shooter', // affiné plus bas (fps)
  Fighting: 'fighting',
  Racing: 'racing',
  Sport: 'sport',
  Simulator: 'simulation',
  Strategy: 'strategy',
  'Real Time Strategy (RTS)': 'rts',
  'Turn-based strategy (TBS)': 'turn-based-strategy',
  Tactical: 'tactical',
  Puzzle: 'puzzle',
  'Point-and-click': 'point-and-click',
  'Visual Novel': 'visual-novel',
  Music: 'rhythm',
  Pinball: 'pinball',
  'Quiz/Trivia': 'quiz',
  'Card & Board Game': 'board-card',
  MOBA: 'moba',
  Arcade: 'arcade',
  Adventure: 'adventure',
  "Hack and slash/Beat 'em up": 'hack-and-slash',
}

const IGDB_THEME_MAP = {
  Action: 'action',
  Horror: 'horror',
  Stealth: 'stealth',
  Survival: 'survival',
  Sandbox: 'sandbox',
  Party: 'party-game',
}

/**
 * Convertit les genres/thèmes IGDB vers la liste commune de VGC (ids de GENRES
 * côté front). IGDB sert de suggestion : l'utilisateur peut corriger à la main.
 */
export function mapIgdbToVgcGenres(g) {
  const names = (g?.genres || []).map((x) => x?.name).filter(Boolean)
  const themes = (g?.themes || []).map((x) => x?.name).filter(Boolean)
  const out = new Set()
  for (const name of names) {
    const id = IGDB_GENRE_MAP[name]
    if (id) out.add(id)
  }
  for (const name of themes) {
    const id = IGDB_THEME_MAP[name]
    if (id) out.add(id)
  }

  if (out.has('shooter')) {
    out.delete('shooter')
    out.add('fps')
  }
  const hasAction = out.has('action') || out.has('hack-and-slash')
  if (out.has('rpg') && hasAction) {
    out.delete('rpg')
    out.delete('action')
    out.delete('hack-and-slash')
    out.add('action-rpg')
  }
  if (out.has('adventure') && out.has('action')) {
    out.delete('adventure')
    out.delete('action')
    out.add('action-adventure')
  }
  // Les genres plus précis rendent les génériques redondants
  const specific = [
    'action-rpg',
    'action-adventure',
    'platformer',
    'fighting',
    'fps',
    'hack-and-slash',
  ]
  if (specific.some((id) => out.has(id))) out.delete('action')
  if (out.has('action-rpg') || out.has('rpg')) out.delete('adventure')
  if (out.has('rts') || out.has('turn-based-strategy') || out.has('tactical')) {
    out.delete('strategy')
  }

  return [...out].slice(0, 3)
}
