import Typography from '@material-ui/core/Typography'

import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { ScriptModel } from '../../models'
import { useCompilationContext } from './compilation-context'
import CompilationPageActions from './compilation-page-actions'
import classes from './compilation-page.module.scss'
import PlayButton from './play-button'
import ScriptItem from './script-item'

interface Props {
  onClickRemoveScriptFromScript: (script: ScriptModel) => () => void
  createOnMouseEvent: (script: ScriptModel | undefined) => () => void
  onClear: () => void
  onClickPlayPause: () => void
}

const CompilationPageContent: React.FC<Props> = ({ onClear, onClickPlayPause, onClickRemoveScriptFromScript, createOnMouseEvent }) => {
  const { t } = useTranslation()
  const { compilationScripts, hoveringScript } = useCompilationContext()

  const scriptsList: JSX.Element[] = useMemo(() => {
    return compilationScripts.map(script => {
      const onMouseEnterScript = createOnMouseEvent(script)
      const onMouseLeaveScript = createOnMouseEvent(undefined)
      const onMouseMoveScript = createOnMouseEvent(script)

      return (
        <ScriptItem
          key={script.id}
          hovering={hoveringScript === script}
          onClickRemoveScript={onClickRemoveScriptFromScript(script)}
          onMouseEnter={onMouseEnterScript}
          onMouseLeave={onMouseLeaveScript}
          onMouseMove={onMouseMoveScript}
          script={script}
        />
      )
    })
  }, [compilationScripts, createOnMouseEvent, hoveringScript, onClickRemoveScriptFromScript])

  return (
    <>
      {compilationScripts.length > 0 ? (
        <div className="app-compilation-scripts-list">{scriptsList}</div>
      ) : (
        <>
          <Typography variant="body1">{t('page.compilation.dragAndDropText')}</Typography>
          <Typography variant="body1">{t('page.compilation.dragAndDropAdmin')}</Typography>
        </>
      )}

      <CompilationPageActions hasScripts={scriptsList.length > 0} onClearScripts={onClear} />

      <div className={classes.fabs}>
        <PlayButton onClick={onClickPlayPause} />
      </div>
    </>
  )
}

export default CompilationPageContent
