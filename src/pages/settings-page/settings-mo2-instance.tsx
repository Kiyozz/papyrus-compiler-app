import Collapse from '@material-ui/core/Collapse'
import Alert from '@material-ui/lab/Alert'

import React from 'react'
import { useTranslation } from 'react-i18next'

import FolderTextField from '../../components/folder-text-field/folder-text-field'
import { useSettings } from './settings-context'
import SettingsMo2List from './settings-mo2-list'

interface Props {
  onChangeMo2Instance: (value: string) => void
}

const SettingsMo2Instance: React.FC<Props> = ({ onChangeMo2Instance }) => {
  const { t } = useTranslation()
  const { mo2, mo2Folders, mo2FoldersError, mo2Instance, limitation, mo2Service } = useSettings()

  return (
    <Collapse in={mo2}>
      <FolderTextField
        error={!!mo2FoldersError}
        value={mo2Instance}
        label={t('page.settings.mo2.instance')}
        onChange={onChangeMo2Instance}
      />

      <Collapse in={!!mo2FoldersError}>
        <Alert severity="error">
          {mo2FoldersError?.message}
        </Alert>
      </Collapse>

      <Collapse in={mo2Folders.length > 0 && !!mo2Instance}>
        <SettingsMo2List limitationText={t('page.settings.mo2.limit', { limit: `${limitation}/${mo2Service.windowsCmdLimitation}` })} />
      </Collapse>
    </Collapse>
  )
}

export default SettingsMo2Instance
