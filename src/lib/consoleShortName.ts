function hardwareKey(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '')
}

/** More specific names first, so "PS3" does not become "PS1". */
const SHORT_NAMES: [RegExp, string][] = [
  [/switch2|nintendoswitch2/, 'Switch 2'],
  [/nintendoswitch|switch/, 'Switch'],
  [/playstation5|ps5/, 'PS5'],
  [/playstation4|ps4/, 'PS4'],
  [/playstation3|ps3/, 'PS3'],
  [/playstation2|ps2/, 'PS2'],
  [/playstationportable|^psp$|sonypsp/, 'PSP'],
  [/psvita|vita/, 'Vita'],
  [/playstationvr2|psvr2/, 'PSVR2'],
  [/playstationvr|psvr/, 'PSVR'],
  [/playstation|psx|ps1|psone/, 'PS1'],
  [/xboxseries|seriesx|seriesxs/, 'Series'],
  [/xboxone/, 'Xbox One'],
  [/xbox360/, '360'],
  [/^xbox|microsoftxbox/, 'Xbox'],
  [/wiiu/, 'Wii U'],
  [/^wii|nintendowii/, 'Wii'],
  [/gamecube|ngc|^gc$/, 'GC'],
  [/n64|nintendo64/, 'N64'],
  [/3ds|nintendo3ds/, '3DS'],
  [/nds|nintendods/, 'DS'],
  [/snes|supernintendo|superfamicom/, 'SNES'],
  [/^nes$|famicom|nintendoentertainment/, 'NES'],
  [/gameboyadvance|gba/, 'GBA'],
  [/gameboycolor|gbc/, 'GBC'],
  [/gameboy|^gb$/, 'GB'],
  [/virtualboy/, 'VB'],
  [/dreamcast|^dc$/, 'DC'],
  [/saturn/, 'Saturn'],
  [/megadrive|genesis/, 'MD'],
  [/mastersystem|^sms$/, 'SMS'],
  [/gamegear|^gg$/, 'GG'],
  [/32x/, '32X'],
  [/segacd|megacd/, 'MCD'],
  [/neogeocd/, 'Neo CD'],
  [/neogeo/, 'Neo Geo'],
  [/pcengine|turbografx/, 'PCE'],
  [/^pc$|windows|steam/, 'PC'],
]

export function consoleShortName(name: string) {
  const key = hardwareKey(name)
  if (!key) return name
  for (const [pattern, short] of SHORT_NAMES) {
    if (pattern.test(key)) return short
  }
  return name
}
