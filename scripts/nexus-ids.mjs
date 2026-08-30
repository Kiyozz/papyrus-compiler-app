// Prints the NexusMods ids the `nexusmods` job of .github/workflows/release.yml
// needs, for the mod pages given as arguments:
//
//   NEXUSMODS_API_KEY=... node scripts/nexus-ids.mjs skyrimspecialedition/23852
//
// Neither id is readable from the mod page URL: the number in there is the
// game-scoped id, while the v3 API wants its own `mod_id`, and `file_id` (the
// persistent file a new version is added to) only shows up under "API Info" in
// the Files tab. The key is a personal one, from
// https://www.nexusmods.com/settings/api-keys.
const apiKey = process.env.NEXUSMODS_API_KEY
const pages = process.argv.slice(2)

if (!apiKey || pages.length === 0) {
  console.error(
    'usage: NEXUSMODS_API_KEY=<key> node scripts/nexus-ids.mjs <game-domain>/<id-in-url>...',
  )
  process.exit(1)
}

const api = async (path) => {
  const response = await fetch(`https://api.nexusmods.com/v3${path}`, {
    headers: {
      apikey: apiKey,
      'User-Agent': 'papyrus-compiler-app/nexus-ids',
    },
  })

  if (!response.ok) {
    throw new Error(`GET ${path}: ${response.status} ${await response.text()}`)
  }

  return (await response.json()).data
}

try {
  for (const page of pages) {
    const [domain, gameScopedId] = page.split('/')

    if (!domain || !gameScopedId) {
      console.error(`skipping "${page}": expected <game-domain>/<id-in-url>`)
      continue
    }

    const { id: modId, name } = await api(
      `/games/${domain}/mods/${gameScopedId}`,
    )
    const { mod_files: files } = await api(`/mods/${modId}/files`)

    console.log(
      `\n${name ?? '?'} — https://www.nexusmods.com/${domain}/mods/${gameScopedId}`,
    )
    console.log(`  mod_id: ${modId}`)

    if (files.length === 0) {
      console.log(
        '  no file yet: upload one by hand, the action only adds versions to an existing file',
      )
    }

    for (const file of files) {
      console.log(
        `  file_id: ${file.id} # ${file.name}${file.is_active ? '' : ' (inactive)'}`,
      )
    }
  }
} catch (error) {
  console.error(error.message)
  process.exit(1)
}
