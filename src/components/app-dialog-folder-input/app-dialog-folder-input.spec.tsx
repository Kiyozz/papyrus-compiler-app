import { shallow } from 'enzyme'
import React from 'react'
import AppDialogFolderInput, { Props } from './app-dialog-folder-input'

describe('<AppDialogFolderInput>', () => {
  const render = () => {
    const props: Props = {
      id: '1',
      name: 'toto',
      value: 'tata',
      onChange: () => {}
    }

    return (
      <AppDialogFolderInput {...props} />
    )
  }

  it('renders correctly', () => {
    const component = (
      render()
    )

    expect(component).toBeTruthy()
  })

  it('matches snapshot', () => {
    const component = shallow((
      render()
    ))

    expect(component).toMatchSnapshot()
    expect(component).toHaveProp('onClick')
    expect(component).toContainExactlyOneMatchingElement('input')
  })
})
