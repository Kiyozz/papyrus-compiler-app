import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import React, { useContext } from 'react'
import { CSSTransition } from 'react-transition-group'
import AppTitle from '../../components/app-title/app-title'
import { GroupModel, ScriptModel } from '../../models'
import AppCompilationGroups from './app-compilation-groups'
import { useCompilationContext } from './compilation-context'

interface Props {
  onChangeGroup: ({ value }: { value: GroupModel }) => void
  onClickPlayPause: (e: React.MouseEvent<HTMLDivElement>) => void
}

const AppCompilationTitle: React.FC<Props> = ({ onChangeGroup, onClickPlayPause }) => {
  const { groups, justLoadedGroup, isCompilationRunning, compilationScripts } = useCompilationContext()

  return (
    <AppTitle className="d-flex">
      Compilation

      <div className="app-compilation-action-group">
        <AppCompilationGroups
          groups={groups}
          onChangeGroup={onChangeGroup}
        />
      </div>

      <CSSTransition
        timeout={300}
        mountOnEnter
        unmountOnExit
        classNames="app-fade"
        in={!!justLoadedGroup}
      >
        <>
          {justLoadedGroup && (
            <span className="app-compilation-action-group-loaded">{justLoadedGroup.name} loaded!</span>
          )}
        </>
      </CSSTransition>

      <CSSTransition
        timeout={300}
        in={compilationScripts.length > 0}
        classNames="app-fade"
        mountOnEnter
      >
        <>
          <div className="app-compilation-actions">
            <div
              className={classNames({
                'app-compilation-action': true,
                'app-compilation-action-disable': isCompilationRunning || compilationScripts.length === 0
              })}
              onClick={onClickPlayPause}
            >
              <FontAwesomeIcon
                spin={isCompilationRunning}
                icon={isCompilationRunning ? 'circle-notch' : 'play-circle'}
              />
            </div>
          </div>
        </>
      </CSSTransition>
    </AppTitle>
  )
}

export default React.memo(AppCompilationTitle)
