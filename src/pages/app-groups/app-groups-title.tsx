import AddCircleIcon from '@material-ui/icons/AddCircle'
import React from 'react'
import AppButton from '../../components/app-button/app-button'
import AppTitle from '../../components/app-title/app-title'

interface Props {
  onClickAddButton: () => void
}

const AppGroupsTitle: React.FC<Props> = ({ onClickAddButton }) => (
  <AppTitle className="d-flex">
    Groups

    <div className="app-groups-actions">
      <AppButton onClick={onClickAddButton} variant="contained" color="primary" startIcon={<AddCircleIcon />}>
        Add
      </AppButton>
    </div>
  </AppTitle>
)

export default AppGroupsTitle
