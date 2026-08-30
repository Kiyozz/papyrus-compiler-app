/*
 * 2026 Kiyozz.
 */

import { Trans, useLingui } from '@lingui/react/macro'
import {
  toCkSteam,
  toCompilerDir,
  toCompilerSourceFile,
  toExecutable,
  toExtender,
  toSteamInstallUrl,
  toSteamStoreUrl,
} from '#common/game.ts'
import { TelemetryEvent } from '#common/telemetry-event.ts'
import { bridge } from '@renderer/bridge.ts'
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@renderer/components/ui/alert.tsx'
import { Button } from '@renderer/components/ui/button.tsx'
import { useApp } from '@renderer/hooks/use-app.tsx'
import { useDocumentation } from '@renderer/hooks/use-documentation.ts'
import { useTelemetry } from '@renderer/hooks/use-telemetry.tsx'
import { useSettings } from '@renderer/pages/settings/use-settings.tsx'
import { cn } from '@renderer/lib/utils.ts'
import {
  BookIcon,
  DownloadIcon,
  FileSearchIcon,
  FolderOpenIcon,
  PackageOpenIcon,
  TriangleAlertIcon,
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import type { DiagnosticId, DiagnosticItem } from '#common/types/diagnostic.ts'

interface CkDiagnosticProps {
  className?: string
  /** restricts the report to these items, every one of them by default */
  only?: DiagnosticId[]
}

function CkDiagnostic({ className, only }: CkDiagnosticProps) {
  const { diagnostic } = useSettings()
  const items =
    only === undefined
      ? diagnostic.items
      : diagnostic.items.filter((item) => only.includes(item.id))

  if (items.length === 0) {
    return null
  }

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {items.map((item) => (
        <DiagnosticAlert key={item.id} item={item} />
      ))}
    </div>
  )
}

function DiagnosticAlert({ item }: { item: DiagnosticItem }) {
  const {
    config: { game },
  } = useApp()

  return (
    <Alert
      variant={item.severity === 'warning' ? 'warning' : 'destructive'}
      className="gap-2"
    >
      {item.severity === 'warning' ? (
        <PackageOpenIcon className="size-4" />
      ) : (
        <TriangleAlertIcon className="size-4" />
      )}
      {item.id === 'game-exe' && (
        <>
          <AlertTitle>
            <Trans>Le jeu est introuvable</Trans>
          </AlertTitle>
          <AlertDescription>
            <Trans>
              Vérifiez que "{toExecutable(game.type)}" se trouve bien dans le
              dossier du jeu.
            </Trans>
          </AlertDescription>
        </>
      )}
      {item.id === 'ck-missing' && <CkMissing />}
      {item.id === 'sources-archived' && <SourcesArchived item={item} />}
      {item.id === 'compiler' && <CompilerMissing />}
      {item.id === 'sources-missing' && <SourcesMissing />}
      {item.id === 'sources-legacy' && <SourcesLegacy item={item} />}
      {item.id === 'compiler-foreign' && <CompilerForeign item={item} />}
      {item.id === 'extender-sources' && <ExtenderSources />}
    </Alert>
  )
}

function CkMissing() {
  const {
    config: { game },
  } = useApp()
  const { send } = useTelemetry()
  const ck = toCkSteam(game.type)

  const onClickSteam = (href: string) => {
    send(TelemetryEvent.ckSteamOpened, { game: game.type })
    void bridge.shell.openExternal(href)
  }

  return (
    <>
      <AlertTitle>
        <Trans>Creation Kit non installé</Trans>
      </AlertTitle>
      <AlertDescription className="flex flex-col items-start gap-3">
        <div className="flex flex-col gap-2">
          <span>
            <Trans>
              PCA n'a trouvé aucun script source de {game.type}. Le Creation Kit
              s'installe gratuitement depuis Steam, en cherchant "{ck.name}", et
              dépose ces scripts dans le dossier du jeu.
            </Trans>
          </span>
          {ck.isFallback && (
            <span>
              <Trans>
                Il n'existe pas de Creation Kit pour Skyrim VR : installez celui
                de Skyrim Special Edition, et choisissez le dossier de Skyrim VR
                au moment de l'installation dans Steam.
              </Trans>
            </span>
          )}
          <span>
            <Trans>
              Si vous avez déjà un PapyrusCompiler.exe ailleurs, vous pouvez le
              désigner : celui de Skyrim Special Edition compile aussi bien pour
              Skyrim VR. Les scripts sources, eux, doivent se trouver dans le
              dossier de {game.type}.
            </Trans>
          </span>
          {!ck.hasStorePage && (
            <span>
              <Trans>
                Ce Creation Kit n'a pas de page dans le magasin : dans Steam,
                ouvrez Bibliothèque puis Outils pour l'installer.
              </Trans>
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => onClickSteam(toSteamInstallUrl(ck.appId))}
            size="sm"
          >
            <DownloadIcon />
            <Trans>Installer via Steam</Trans>
          </Button>
          {ck.hasStorePage && (
            <Button
              onClick={() => onClickSteam(toSteamStoreUrl(ck.appId))}
              size="sm"
              variant="outline"
            >
              <Trans>Voir sur le magasin Steam</Trans>
            </Button>
          )}
          <CompilerPicker />
        </div>
      </AlertDescription>
    </>
  )
}

function SourcesArchived({ item }: { item: DiagnosticItem }) {
  const {
    config: { game },
  } = useApp()
  const { extract } = useSettings()
  const { send } = useTelemetry()
  const { t } = useLingui()
  const [isExtracting, setExtracting] = useState(false)
  const archives = item.archives ?? []
  const extractable = archives.filter((archive) => archive.extractable)
  const first = archives[0]

  const onClickExtract = async () => {
    setExtracting(true)

    try {
      const results = await extract(extractable.map((archive) => archive.path))
      const failed = results.filter((result) => !result.ok)

      send(TelemetryEvent.ckArchivesExtracted, {
        game: game.type,
        archives: results.length,
        failed: failed.length,
      })

      if (failed.length === 0) {
        toast.success(t`Archives extraites`)

        return
      }

      toast.error(t`L'extraction a échoué`, {
        description: failed.some((result) => result.denied)
          ? t`Le dossier du jeu est protégé en écriture. Extrayez les archives vous-même, ou installez le jeu hors de Program Files.`
          : failed[0]?.error,
        duration: Infinity,
      })
    } finally {
      setExtracting(false)
    }
  }

  return (
    <>
      <AlertTitle>
        <Trans>Scripts sources non extraits</Trans>
      </AlertTitle>
      <AlertDescription className="flex flex-col items-start gap-3">
        <div className="flex flex-col gap-2">
          <span>
            <Trans>
              Le Creation Kit livre les scripts sources du jeu dans des
              archives. Tant qu'elles ne sont pas extraites, la compilation
              échoue.
            </Trans>
          </span>
          <ul className="list-inside list-disc">
            {archives.map((archive) => (
              <li key={archive.path}>{archive.name}</li>
            ))}
          </ul>
          {extractable.length === 0 && (
            <span>
              <Trans>
                PCA ne sait pas ouvrir une archive .rar : extrayez-la vous-même
                avec 7-Zip ou WinRAR, en conservant les dossiers.
              </Trans>
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {extractable.length > 0 && (
            <Button onClick={onClickExtract} disabled={isExtracting} size="sm">
              <PackageOpenIcon />
              {isExtracting ? (
                <Trans>Extraction…</Trans>
              ) : (
                <Trans>Tout extraire</Trans>
              )}
            </Button>
          )}
          {first !== undefined && (
            <Button
              onClick={() => void bridge.shell.showInFolder(first.path)}
              size="sm"
              variant="outline"
            >
              <FolderOpenIcon />
              <Trans>Ouvrir le dossier</Trans>
            </Button>
          )}
        </div>
      </AlertDescription>
    </>
  )
}

function CompilerPicker({
  variant = 'outline',
}: {
  variant?: 'default' | 'outline'
}) {
  const { setConfig } = useApp()
  const onClickSelect = async () => {
    const compilerPath = await bridge.dialog.select('file')

    if (compilerPath !== null) {
      // the report refreshes on its own: both hosts watch the compiler path
      setConfig({ compilation: { compilerPath } })
    }
  }

  return (
    <Button onClick={onClickSelect} size="sm" variant={variant}>
      <FileSearchIcon />
      <Trans>Choisir PapyrusCompiler.exe</Trans>
    </Button>
  )
}

function CompilerMissing() {
  const {
    config: { game, compilation },
  } = useApp()

  return (
    <>
      <AlertTitle>
        <Trans>Compilateur Papyrus introuvable</Trans>
      </AlertTitle>
      <AlertDescription className="flex flex-col items-start gap-3">
        <span>
          {compilation.compilerPath === '' ? (
            <Trans>
              Le Creation Kit installe PapyrusCompiler.exe dans le dossier "
              {toCompilerDir(game.type)}" du jeu.
            </Trans>
          ) : (
            <Trans>
              "{compilation.compilerPath}" n'existe pas. Le Creation Kit
              installe PapyrusCompiler.exe dans le dossier "
              {toCompilerDir(game.type)}" du jeu.
            </Trans>
          )}
        </span>
        <CompilerPicker />
      </AlertDescription>
    </>
  )
}

function CompilerForeign({ item }: { item: DiagnosticItem }) {
  const {
    config: { game, compilation },
    setConfig,
  } = useApp()
  const own = item.compilerPath

  if (item.game === undefined) {
    return null
  }

  return (
    <>
      <AlertTitle>
        <Trans>Le compilateur vient de {item.game}</Trans>
      </AlertTitle>
      <AlertDescription className="flex flex-col items-start gap-3">
        <span>
          <Trans>
            PCA compilerait du {game.type} avec "{compilation.compilerPath}",
            qui appartient à {item.game}. Ces compilateurs ne sont pas
            interchangeables. Si vous venez de changer de jeu, c'est un reste du
            précédent.
          </Trans>
        </span>
        <div className="flex flex-wrap gap-2">
          {own !== undefined && (
            <Button
              onClick={() => setConfig({ compilation: { compilerPath: own } })}
              size="sm"
            >
              <Trans>Utiliser celui de {game.type}</Trans>
            </Button>
          )}
          <CompilerPicker variant={own === undefined ? 'default' : 'outline'} />
        </div>
      </AlertDescription>
    </>
  )
}

function SourcesMissing() {
  const {
    config: { game },
  } = useApp()
  const { open: openDocumentation } = useDocumentation()

  return (
    <>
      <AlertTitle>
        <Trans>Scripts sources introuvables</Trans>
      </AlertTitle>
      <AlertDescription className="flex flex-col items-start gap-3">
        <span>
          <Trans>
            PCA cherche le fichier {toCompilerSourceFile(game.type)} dans les
            dossiers Scripts\Source ou Source\Scripts du dossier Data du jeu
            pour valider l'installation du Creation Kit.
          </Trans>
        </span>
        <Button
          onClick={() => openDocumentation('click')}
          size="sm"
          variant="outline"
        >
          <BookIcon />
          <Trans>Voir la documentation</Trans>
        </Button>
      </AlertDescription>
    </>
  )
}

function SourcesLegacy({ item }: { item: DiagnosticItem }) {
  const {
    config: { game },
  } = useApp()
  const { open: openDocumentation } = useDocumentation()
  const folder = item.sourcePath

  return (
    <>
      <AlertTitle>
        <Trans>Des scripts sources sont dans Scripts\Source</Trans>
      </AlertTitle>
      <AlertDescription className="flex flex-col items-start gap-3">
        <div className="flex flex-col gap-2">
          <span>
            <Trans>
              {game.type} range ses scripts sources dans Data\Source\Scripts, et
              le Creation Kit ne lit que ce dossier. Data\Scripts\Source est
              celui de Skyrim LE : tout ce qui y reste lui est invisible.
            </Trans>
          </span>
          <span>
            <Trans>
              PCA, lui, l'importe avant Data\Source\Scripts : une ancienne copie
              des scripts du jeu qui y traîne masque celle de {game.type}, et la
              compilation échoue sans raison apparente.
            </Trans>
          </span>
          <span>
            <Trans>
              Déplacez tout le contenu de Data\Scripts\Source vers
              Data\Source\Scripts.
            </Trans>
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {folder !== undefined && (
            <Button
              onClick={() => void bridge.shell.showInFolder(folder)}
              size="sm"
            >
              <FolderOpenIcon />
              <Trans>Ouvrir le dossier</Trans>
            </Button>
          )}
          <Button
            onClick={() => openDocumentation('click')}
            size="sm"
            variant="outline"
          >
            <BookIcon />
            <Trans>Voir la documentation</Trans>
          </Button>
        </div>
      </AlertDescription>
    </>
  )
}

function ExtenderSources() {
  const {
    config: { game },
  } = useApp()
  const extender = toExtender(game.type)

  if (extender === undefined) {
    return null
  }

  return (
    <>
      <AlertTitle>
        <Trans>{extender.name} est installé, sans ses scripts sources</Trans>
      </AlertTitle>
      <AlertDescription className="flex flex-col items-start gap-3">
        <span>
          <Trans>
            La compilation fonctionne, mais tout script utilisant une fonction
            de {extender.name} échouera. Copiez le dossier Data\Scripts\Source
            de l'archive {extender.name} dans le dossier du jeu.
          </Trans>
        </span>
        <Button
          onClick={() => void bridge.shell.openExternal(extender.url)}
          size="sm"
          variant="outline"
        >
          <DownloadIcon />
          <Trans>Télécharger {extender.name}</Trans>
        </Button>
      </AlertDescription>
    </>
  )
}

export default CkDiagnostic
