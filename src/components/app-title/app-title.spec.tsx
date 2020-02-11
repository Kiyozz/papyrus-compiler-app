import { shallow } from 'enzyme'
import React from 'react'
import AppTitle from './app-title'

describe('<AppTitle>', () => {
  it('renders correctly', () => {
    const component = (
      <AppTitle>Toto</AppTitle>
    )

    expect(component).toBeTruthy()
  })

  it('matches snapshot and be a h1', () => {
    const component = shallow((
      <AppTitle>toto</AppTitle>
    ))

    expect(component).toMatchSnapshot()
    expect(component.find('h1')).toHaveLength(1)
  })

  it('matches snapshot and accept a classname', () => {
    const component = shallow((
      <AppTitle className="yo">toto</AppTitle>
    ))

    expect(component).toMatchSnapshot()
    expect(component.find('h1.yo')).toHaveLength(1)
  })
})
