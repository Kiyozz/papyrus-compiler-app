import React, { useMemo } from 'react'
import Select from 'react-select'
import { GroupModel } from '../../models'

interface Props {
  groups: GroupModel[]
  onChangeGroup: ({ value }: { value: GroupModel }) => void
}

const AppCompilationGroups: React.FC<Props> = ({ groups, onChangeGroup }) => {
  const groupSelectOptions = useMemo(() => {
    return groups.filter(group => group.scripts.length > 0).map(group => {
      return {
        label: `Group ${group.name}`,
        value: group
      }
    })
  }, [groups])

  return (
    <div className="app-compilation-action-group">
      {groups.length > 0 && (
        <Select
          placeholder="Load a group"
          onChange={onChangeGroup as any}
          options={groupSelectOptions}
        />
      )}
    </div>
  )
}

export default React.memo(AppCompilationGroups)
