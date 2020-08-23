import { toAntiSlash, toSource } from '@common'
import { useMemo } from 'react'
import { usePageContext } from '../components/page/page-context'

interface Out {
  current: number
  max: number
}

export function useCmdLimitation(sources: string[]): Out {
  const {
    config: {
      mo2: { instance, output },
      gamePath,
      gameType,
      flag,
      compilerPath
    }
  } = usePageContext()
  const max = useMemo(() => 8191, [])

  const baseGameScriptsSources = useMemo(() => toAntiSlash(toSource(gameType)), [gameType])
  const baseBaseScriptsSourcesAbsolute = useMemo(() => toAntiSlash(`${gamePath}/Data/${baseGameScriptsSources}`), [baseGameScriptsSources, gamePath])
  const compilerPathAbsolute = useMemo(() => toAntiSlash(`${gamePath}/${compilerPath}`), [compilerPath, gamePath])
  const instanceWithMods = useMemo(() => toAntiSlash(`${instance}/mods`), [instance])
  const spacesBetweenArgs = 4
  const averageScriptLength = 15

  const foldersSum = useMemo(
    () =>
      sources
        .map(folder => folder.replace(instance ?? '', ''))
        .reduce((previous, next) => {
          previous = next.length + previous

          return previous
        }, 0),
    [instance, sources]
  )

  return {
    current:
      baseBaseScriptsSourcesAbsolute.length +
      compilerPathAbsolute.length +
      instanceWithMods.length +
      flag.length +
      output.length +
      spacesBetweenArgs +
      averageScriptLength +
      foldersSum,
    max
  }
}
