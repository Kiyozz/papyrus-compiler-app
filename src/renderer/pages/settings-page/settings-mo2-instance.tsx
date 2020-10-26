import Collapse from '@material-ui/core/Collapse'

import React from 'react'
import { useTranslation } from 'react-i18next'

import FolderTextField from '../../components/folder-text-field/folder-text-field'
import { usePageContext } from '../../components/page/page-context'

interface Props {
  onChangeMo2Instance: (value: string) => void
}

const SettingsMo2Instance: React.FC<Props> = ({ onChangeMo2Instance }) => {
  const { t } = useTranslation()
  const {
    config: { mo2 }
  } = usePageContext()

  return (
    <Collapse in={mo2.use}>
      <FolderTextField defaultValue={mo2.instance ?? ''} label={t('page.settings.mo2.instance')} onChange={onChangeMo2Instance} />
    </Collapse>
  )
}

export default SettingsMo2Instance
