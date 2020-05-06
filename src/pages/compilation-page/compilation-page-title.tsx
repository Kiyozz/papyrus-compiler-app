import Fade from '@material-ui/core/Fade'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled'

import React from 'react'

import Title from '../../components/title/title'
import GroupsLoader from './groups-loader'
import { useCompilationContext } from './compilation-context'
import classes from './compilation-page.module.scss'

interface Props {
  onChangeGroup: (groupName: string) => void
  onClickPlayPause: (e: React.MouseEvent<HTMLButtonElement>) => void
}

const CompilationPageTitle: React.FC<Props> = ({ onChangeGroup, onClickPlayPause }) => {
  const { groups, isCompilationRunning, compilationScripts } = useCompilationContext()

  return (
    <Title className="d-flex">
      Compilation

      <div className="app-compilation-action-group">
        <GroupsLoader
          groups={groups}
          onChangeGroup={onChangeGroup}
        />
      </div>

      <Fade in={compilationScripts.length > 0} mountOnEnter>
        <div className={classes.actions}>
          <Button
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
          </Button>
        </div>
      </Fade>
    </Title>
  )
}

export default CompilationPageTitle
