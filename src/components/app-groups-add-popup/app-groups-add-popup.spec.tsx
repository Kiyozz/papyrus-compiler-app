import { shallow } from 'enzyme'
import React from 'react'
import AppGroupsAddPopup from './app-groups-add-popup'

describe('<AppGroupsAddPopup>', () => {
  const render = () => {
    const callback = () => {}

    const props = {
      lastId: 0,
      onGroupAdd: callback,
      onGroupEdit: callback,
      onClose: callback
    }

    return (
      <AppGroupsAddPopup {...props} />
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
    expect(component).toContainExactlyOneMatchingElement('form')
  })
})
