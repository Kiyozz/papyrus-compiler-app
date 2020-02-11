import { shallow } from 'enzyme'
import React from 'react'
import AppSubtitle from './app-subtitle'

describe('<AppSubtitle>', () => {
  it('renders correctly', () => {
    const component = (
      <AppSubtitle />
    )

    expect(component).toBeTruthy()
  })

  it('matches snapshot', () => {
    const component = shallow((
      <AppSubtitle>TOTO</AppSubtitle>
    ))

    expect(component).toMatchSnapshot()
    expect(component.find('h2')).toHaveLength(1)
  })
})
