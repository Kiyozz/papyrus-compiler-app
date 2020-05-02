import Fade from '@material-ui/core/Fade'
import CircularProgress from '@material-ui/core/CircularProgress'
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled'
import React from 'react'
import AppButton from '../../components/app-button/app-button'
import AppTitle from '../../components/app-title/app-title'
import AppCompilationGroups from './app-compilation-groups'
import { useCompilationContext } from './compilation-context'

interface Props {
  onChangeGroup: (groupName: string) => void
  onClickPlayPause: (e: React.MouseEvent<HTMLButtonElement>) => void
}

const AppCompilationTitle: React.FC<Props> = ({ onChangeGroup, onClickPlayPause }) => {
  const { groups, isCompilationRunning, compilationScripts } = useCompilationContext()

  return (
    <AppTitle className="d-flex">
      Compilation

      <div className="app-compilation-action-group">
        <AppCompilationGroups
          groups={groups}
          onChangeGroup={onChangeGroup}
        />
      </div>

      <Fade in={compilationScripts.length > 0} mountOnEnter>
        <>
          <div className="app-compilation-actions">
            <AppButton
              onClick={onClickPlayPause}
              color="primary"
              aria-label="play"
              variant="contained"
              disabled={isCompilationRunning || compilationScripts.length === 0}
              startIcon={(
                isCompilationRunning ? (
                  <CircularProgress size={18} />
                ) : (
                  <PlayCircleFilledIcon />
                )
              )}
            >
              Play
            </AppButton>
          </div>
        </>
      </Fade>
    </AppTitle>
  )
}

export default React.memo(AppCompilationTitle)
