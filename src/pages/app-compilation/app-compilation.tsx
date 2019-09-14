import classNames from 'classnames'
import uniqBy from 'lodash-es/uniqBy'
import React, { useCallback, useMemo, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { CSSTransition } from 'react-transition-group'
import Select from 'react-select'
import './app-compilation.scss'
import AppTitle from '../../components/app-title/app-title'
import AppContainerLogs from '../../components/app-compilation-logs/app-compilation-logs.container'
import { GroupModel, ScriptModel } from '../../models'
import { format } from '../../utils/date/format'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ScriptStatus } from '../../enums/script-status.enum'
import getIconFromStatus from '../../utils/scripts/get-icon-from-status'
import getClassNameFromStatus from '../../utils/scripts/get-classname-from-status'
import pscFilesToPscScripts from '../../utils/scripts/psc-files-to-psc-scripts'
import { map, max } from 'lodash-es'
import useTimeout from '../../hooks/use-timeout'

export interface StateProps {
  isCompilationRunning: boolean
  compilationScripts: ScriptModel[]
  popupOpen: boolean
  groups: GroupModel[]
}

export interface DispatchesProps {
  startCompilation: (scripts: ScriptModel[]) => void
  setCompilationScripts: (scripts: ScriptModel[]) => void
}

type Props = StateProps & DispatchesProps

const AppCompilation: React.FC<Props> = ({ startCompilation, compilationScripts, setCompilationScripts, isCompilationRunning, popupOpen, groups }) => {
  const onClickRemoveScriptFromScript = useCallback((script: ScriptModel) => {
    return () => {
      const newListOfScripts = compilationScripts.filter(compilationScript => compilationScript !== script)

      setCompilationScripts(newListOfScripts)
    }
  }, [setCompilationScripts, compilationScripts])

  const [justLoadedGroup, setJustLoadedGroup] = useState<GroupModel | undefined>(undefined)

  const [isHoveringScript, setHoveringScript] = useState<ScriptModel | undefined>(undefined)
  const createOnMouseEvent = useCallback((script?: ScriptModel) => {
    return () => {
      if (isCompilationRunning) {
        return
      }

      if (isHoveringScript !== script) {
        setHoveringScript(script)
      }
    }
  }, [setHoveringScript, isHoveringScript, isCompilationRunning])

  const onClickPlayPause = useCallback(() => {
    if (compilationScripts.length === 0) {
      return
    }

    startCompilation(compilationScripts)
  }, [compilationScripts, startCompilation])

  const onDrop = useCallback((pscFiles: File[]) => {
    const pscScripts: ScriptModel[] = pscFilesToPscScripts(pscFiles, compilationScripts)

    setCompilationScripts(uniqBy([...compilationScripts, ...pscScripts], 'name'))
  }, [setCompilationScripts, compilationScripts])
  const { getRootProps, isDragActive } = useDropzone({
    onDrop,
    accept: '.psc',
    preventDropOnDocument: true
  })

  const scriptsList = useMemo(() => {
    return compilationScripts.map((script) => {
      const onMouseEnterScript = createOnMouseEvent(script)
      const onMouseLeaveScript = createOnMouseEvent(undefined)
      const onMouseMoveScript = createOnMouseEvent(script)

      return (
        <div
          key={script.id}
          className="list-group-item"
          onMouseEnter={onMouseEnterScript}
          onMouseLeave={onMouseLeaveScript}
          onMouseMove={onMouseMoveScript}
        >
          <CSSTransition
            timeout={150}
            in={isHoveringScript === script}
            classNames="app-fade-grow"
            mountOnEnter
            unmountOnExit
          >
            <div className="app-list-group-item-script-hover">
              <span onClick={onClickRemoveScriptFromScript(script)}>
                <FontAwesomeIcon icon="trash" />
              </span>
            </div>
          </CSSTransition>
          <div className="app-list-group-item-script-name">{script.name}</div>
          <div className="app-list-group-item-script-path ml-2 mt-2">
            Last edited at {format(script.lastModified, 'PPpp')}
            <span className={classNames(['app-list-group-item-script-status', getClassNameFromStatus(script)])}>
              <FontAwesomeIcon
                spin={script.status === ScriptStatus.RUNNING}
                icon={getIconFromStatus(script)}
              />
            </span>
          </div>
        </div>
      )
    })
  }, [compilationScripts, createOnMouseEvent, isHoveringScript, onClickRemoveScriptFromScript])

  const groupSelectOptions = useMemo(() => {
    return groups.filter(group => group.scripts.length > 0).map(group => {
      return {
        label: `Group ${group.name}`,
        value: group
      }
    })
  }, [groups])

  const onChangeGroup = useCallback(({ value: group }) => {
    const lastId = max(map(compilationScripts, 'id'))
    const scripts: ScriptModel[] = group.scripts.map((script: ScriptModel) => {
      script.id = (lastId || 0) + script.id

      return script
    })

    setJustLoadedGroup(group)
    setCompilationScripts(
      uniqBy([...compilationScripts, ...scripts], 'name')
    )
  }, [compilationScripts, setCompilationScripts])

  useTimeout(() => {
    if (!justLoadedGroup) {
      return
    }

    setJustLoadedGroup(undefined)
  }, { time: 3000 })

  return (
    <div
      className={classNames({
        'app-compilation container': true,
        'app-compilation-is-dragging': isDragActive
      })}
      {...getRootProps()}
    >
      <AppTitle className="d-flex">
        Compilation

        <div className="app-compilation-action-group">
          {groups.length > 0 && (
            <Select
              placeholder="Load a group"
              onChange={onChangeGroup}
              options={groupSelectOptions}
            />
          )}
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

      <div className="app-compilation-content">
        {!popupOpen && (
          <>
            <CSSTransition
              timeout={300}
              in={isDragActive}
              classNames="app-fade"
              mountOnEnter
              unmountOnExit
            >
              <div className="app-compilation-is-dragging-container">
                Drop files here...
              </div>
            </CSSTransition>

            {scriptsList.length > 0 ? (
              <>
                {scriptsList}
              </>
            ) : (
              <p className="text-secondary text-wrap">
                You can drag and drop psc files to load them into the
                application.
              </p>
            )}
          </>
        )}

        <AppContainerLogs />
      </div>
    </div>
  )
}

export default AppCompilation
