import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './app-groups-add-popup.scss'
import { GroupModel, ScriptModel } from '../../models'
import { useDropzone } from 'react-dropzone'
import { CSSTransition } from 'react-transition-group'
import pscFilesToPscScripts from '../../utils/scripts/psc-files-to-psc-scripts'
import { uniqBy } from 'lodash-es'

interface Props {
  lastId: number
  onGroupAdd: (group: GroupModel) => void
  onGroupEdit: (group: GroupModel) => void
  onClose: () => void
  group: GroupModel | undefined
}

const AppGroupsAddPopup: React.FC<Props> = ({ onGroupAdd, onGroupEdit, lastId, onClose, group }) => {
  const [name, setName] = useState('')
  const [scripts, setScripts] = useState<ScriptModel[]>([])
  const popupRef = useRef<HTMLDivElement>(null)
  const [isEdit, setEdit] = useState(false)

  useEffect(() => {
    if (!group) {
      return
    }

    setName(group.name)
    setScripts(group.scripts)
    setEdit(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onClickRemoveScriptFromGroup = useCallback((script: ScriptModel) => {
    return (e: React.MouseEvent) => {
      e.stopPropagation()

      setScripts(scripts.filter(scriptFromList => scriptFromList.id !== script.id))
    }
  }, [setScripts, scripts])

  const onSubmitAddGroup = useCallback((e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !name.trim()) {
      return
    }

    if (isEdit && group) {
      onGroupEdit({
        id: group.id,
        name: name.trim(),
        scripts
      })

      return
    }

    onGroupAdd({
      id: ++lastId,
      name: name.trim(),
      scripts
    })
  }, [name, isEdit, group, onGroupAdd, lastId, scripts, onGroupEdit])

  const onChangeName = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value

    setName(value)
  }, [setName])

  const onDrop = useCallback((pscFiles: File[]) => {
    const pscScripts = pscFilesToPscScripts(pscFiles)

    setScripts(uniqBy([...scripts, ...pscScripts], 'name'))
  }, [setScripts, scripts])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: '.psc',
    preventDropOnDocument: true
  })

  const scriptsList = useMemo(() => {
    return scripts.map((script, index) => {
      return (
        <div
          key={script.id + index}
          onClick={onClickRemoveScriptFromGroup(script)}
        >
          {script.name}
        </div>
      )
    })
  }, [scripts, onClickRemoveScriptFromGroup])

  const onClickPopupToClose = useCallback((e: React.MouseEvent) => {
    if (!popupRef.current) {
      return
    }

    if (e.target !== popupRef.current) {
      return
    }

    onClose()
  }, [onClose])

  const onClickCancel = useCallback(() => {
    onClose()
  }, [onClose])

  return (
    <div
      className="app-groups-add-popup"
      onClick={onClickPopupToClose}
      ref={popupRef}
    >
      <div className="app-groups-add-popup-container">
        <form
          className="h-100 d-flex flex-column"
          onSubmit={onSubmitAddGroup}
        >
          <div className="form-group">
            <label htmlFor="group-name">Name</label>
            <input
              className="form-control"
              name="group-name"
              id="group-name"
              onChange={onChangeName}
              value={name}
            />
          </div>
          <div
            title="Add scripts"
            className="form-group h-100 overflow-auto cursor-pointer"
            {...getRootProps()}
          >
            <input {...getInputProps()} />

            {scripts.length === 0 && (
              'Drop your scripts files here or click here'
            )}

            <CSSTransition
              timeout={150}
              in={isDragActive}
              classNames="app-fade"
              mountOnEnter
              unmountOnExit
            >
              <div className="app-groups-is-dragging-container">
                Drop files here...
              </div>
            </CSSTransition>

            <div className="app-groups-popup-scripts">
              {scriptsList}
            </div>
          </div>
          <div className="app-groups-add-popup-form-actions">
            <button
              className="btn btn-primary"
              type="submit"
            >
              {isEdit ? 'Edit' : 'Add'}
            </button>
            <button
              className="btn btn-secondary"
              type="button"
              onClick={onClickCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AppGroupsAddPopup
