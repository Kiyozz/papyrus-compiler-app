import { connect } from 'react-redux'
import { RootStore } from '../../redux/stores/root.store'
import AppChangelog, { StateProps, OwnProps } from './app-changelog'

const mapStateToProps = ({ changelog }: RootStore, { onClose }: OwnProps): StateProps & OwnProps => ({
  onClose,
  latestNotesVersion: changelog.version,
  showNotes: changelog.showNotes,
  startingVersion: changelog.startingVersion,
  notes: changelog.notes,
  releaseLink: 'https://www.nexusmods.com/skyrim/mods/96339?tab=files'
})

const AppChangelogContainer = connect(mapStateToProps)(AppChangelog)

export default AppChangelogContainer
