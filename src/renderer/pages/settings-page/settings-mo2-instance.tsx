import Collapse from '@material-ui/core/Collapse'
import Alert from '@material-ui/lab/Alert'
import is from '@sindresorhus/is'

import React from 'react'
import { useTranslation } from 'react-i18next'

import FolderTextField from '../../components/folder-text-field/folder-text-field'
import { usePageContext } from '../../components/page/page-context'
import { useCmdLimitation } from '../../hooks/useCmdLimitation'
import { useSettings } from './settings-context'
import SettingsMo2List from './settings-mo2-list'

interface Props {
  onChangeMo2Instance: (value: string) => void
}

const SettingsMo2Instance: React.FC<Props> = ({ onChangeMo2Instance }) => {
  const { t } = useTranslation()
  const {
    config: { mo2 }
  } = usePageContext()
  const {
    mo2: { sources, sourcesError }
  } = useSettings()

  const { current, max } = useCmdLimitation(sources)

  return (
    <Collapse in={mo2.use}>
      <FolderTextField error={!!sourcesError} value={mo2.instance ?? ''} label={t('page.settings.mo2.instance')} onChange={onChangeMo2Instance} />

      <Collapse in={!is.undefined(sourcesError)}>
        <Alert severity="error">{sourcesError?.message}</Alert>
      </Collapse>

      <Collapse in={sources.length > 0 && !is.nullOrUndefined(mo2.instance)}>
        <SettingsMo2List limitationText={t('page.settings.mo2.limit', { limit: `${current}/${max}` })} />
      </Collapse>
    </Collapse>
  )
}

export default SettingsMo2Instance
