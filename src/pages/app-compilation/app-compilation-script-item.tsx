import DeleteIcon from '@material-ui/icons/Delete'
import classNames from 'classnames'
import React, { useCallback } from 'react'
import { CSSTransition } from 'react-transition-group'
import { ScriptModel } from '../../models'
import { format } from '../../utils/date/format'
import getClassNameFromStatus from '../../utils/scripts/get-classname-from-status'
import getIconFromStatus from '../../utils/scripts/get-icon-from-status'

interface Props {
  script: ScriptModel
  onMouseEnter: () => void
  onMouseLeave: () => void
  onMouseMove: () => void
  onClickRemoveScript: (script: ScriptModel) => void
  hovering: boolean
}

const AppCompilationScriptItem: React.FC<Props> = ({ script, onMouseEnter, onMouseLeave, onMouseMove, onClickRemoveScript, hovering }) => {
  const onClickRemove = useCallback(() => {
    onClickRemoveScript(script)
  }, [script, onClickRemoveScript])

  return (
    <div
      className="list-group-item"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
    >
      <CSSTransition
        timeout={150}
        in={hovering}
        classNames="app-fade-grow"
        mountOnEnter
        unmountOnExit
      >
        <div className="app-list-group-item-script-hover">
          <span onClick={onClickRemove}>
            <DeleteIcon />
          </span>
        </div>
      </CSSTransition>
      <div className="app-list-group-item-script-name">{script.name}</div>
      <div className="app-list-group-item-script-path ml-2 mt-2">
        Last edited at {format(script.lastModified, 'PPpp')}
        <span className={classNames(['app-list-group-item-script-status', getClassNameFromStatus(script)])}>
          {getIconFromStatus(script)}
        </span>
      </div>
    </div>
  )
}

export default React.memo(AppCompilationScriptItem)
