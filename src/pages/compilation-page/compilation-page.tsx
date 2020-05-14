import Button from '@material-ui/core/Button'
import SearchIcon from '@material-ui/icons/Search'

import uniqBy from 'lodash-es/uniqBy'
import React from 'react'
import { connect } from 'react-redux'

import Page from '../../components/page/page'
import PageAppBar from '../../components/page/page-app-bar'
import { useDrop } from '../../hooks/use-drop'
import { GroupModel, ScriptModel } from '../../models'
import { actionSetCompilationScripts, actionStartCompilation } from '../../redux/actions'
import { RootStore } from '../../redux/stores/root.store'
import { pscFilesToPscScripts } from '../../utils/scripts/psc-files-to-psc-scripts'
import CompilationContextProvider from './compilation-context'
import CompilationPageContent from './compilation-page-content'
import GroupsLoader from './groups-loader'

export interface StateProps {
  isCompilationRunning: boolean
  compilationScripts: ScriptModel[]
  groups: GroupModel[]
}

export interface DispatchesProps {
  startCompilation: (scripts: ScriptModel[]) => void
  setCompilationScripts: (scripts: ScriptModel[]) => void
}

type Props = StateProps & DispatchesProps

const Component: React.FC<Props> = ({ startCompilation, groups, compilationScripts, setCompilationScripts, isCompilationRunning }) => {
  const [hoveringScript, setHoveringScript] = React.useState<ScriptModel | undefined>(undefined)
  const onClickRemoveScriptFromScript = (script: ScriptModel) => {
    return () => {
      const newListOfScripts = compilationScripts.filter(compilationScript => compilationScript !== script)

      setCompilationScripts(newListOfScripts)
    }
  }
  const createOnMouseEvent = (script?: ScriptModel) => {
    return () => {
      if (isCompilationRunning) {
        return
      }

      if (hoveringScript !== script) {
        setHoveringScript(script)
      }
    }
  }
  const onClickPlayPause = () => {
    if (compilationScripts.length === 0) {
      return
    }

    startCompilation(compilationScripts)
  }
  const onDrop = (pscFiles: File[]) => {
    const pscScripts: ScriptModel[] = pscFilesToPscScripts(pscFiles, compilationScripts)
    const newScripts = uniqBy([...compilationScripts, ...pscScripts], 'name')

    setCompilationScripts(newScripts.map((script, index) => ({ ...script, id: index })))
  }
  const onChangeGroup = (groupName: string) => {
    const group = groups.find(group => group.name === groupName)

    if (!group) {
      return
    }

    const scripts: ScriptModel[] = uniqBy([...compilationScripts, ...group.scripts], 'name')
      .map((script, index) => ({ ...script, id: index }))

    setCompilationScripts(scripts)
  }
  const onClearScripts = () => {
    setCompilationScripts([])
  }

  const addScriptsButton = useDrop({
    button: (
      <Button color="inherit" startIcon={<SearchIcon />}>
        Search scripts
      </Button>
    ),
    onDrop
  })

  return (
    <CompilationContextProvider hoveringScript={hoveringScript}>
      {/*<DropScripts*/}
      {/*  onDrop={onDrop}*/}
      {/*  accept=".psc"*/}
      {/*  className={classes.fullHeight}*/}
      {/*  buttonClassName={classes.inline}*/}
      {/*  onlyClickButton*/}
      {/*  Button={*/}
      {/*    <Button color="inherit" startIcon={<SearchIcon />}>*/}
      {/*      Search scripts*/}
      {/*    </Button>*/}
      {/*  }*/}
      {/*>*/}
      {/*  {({ Button: AddScriptsButton, isDragActive }) => (*/}
      {/*    <>*/}
      {/*      */}
      {/*    </>*/}
      {/*  )}*/}
      {/*</DropScripts>*/}

      <PageAppBar
        title="Compilation"
        actions={[
          {
            button: addScriptsButton
          },
          {
            button: (
              <GroupsLoader groups={groups} onChangeGroup={onChangeGroup} />
            )
          }
        ]}
      />

      <Page>
        <CompilationPageContent
          createOnMouseEvent={createOnMouseEvent}
          onClickPlayPause={onClickPlayPause}
          onClickRemoveScriptFromScript={onClickRemoveScriptFromScript}
          onClear={onClearScripts}
        />
      </Page>
    </CompilationContextProvider>
  )
}

const CompilationPage = connect(
  (store: RootStore): StateProps => ({
    isCompilationRunning: store.compilation.isCompilationRunning,
    compilationScripts: store.compilation.compilationScripts,
    groups: store.groups.groups
  }),
  (dispatch): DispatchesProps => ({
    startCompilation: scripts => dispatch(actionStartCompilation(scripts)),
    setCompilationScripts: scripts => dispatch(actionSetCompilationScripts(scripts))
  })
)(Component)

export default CompilationPage
