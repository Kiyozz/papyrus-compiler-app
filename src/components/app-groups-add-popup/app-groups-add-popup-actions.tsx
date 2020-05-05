import styled from '@emotion/styled'
import Button from '@material-ui/core/Button'
import React from 'react'

interface Props {
  onClose: () => void
  isEdit: boolean
  AddScriptsButton: JSX.Element
}

const MarginRightAuto = styled.div`
  margin-right: auto;
`

const AppGroupsAddPopupActions: React.FC<Props> = ({ AddScriptsButton, onClose, isEdit }) => {
  return (
    <>
      <MarginRightAuto>
        {AddScriptsButton}
      </MarginRightAuto>
      <Button
        onClick={onClose}
      >
        Close
      </Button>
      <Button
        type="submit"
        color="primary"
        variant="contained"
      >
        {isEdit ? 'Edit' : 'Create'}
      </Button>
    </>
  )
}

export default React.memo(AppGroupsAddPopupActions)
