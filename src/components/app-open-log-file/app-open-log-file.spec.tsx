import { shallow } from 'enzyme'
import React from 'react'
import AppOpenLogFile from './app-open-log-file'

describe('<AppOpenLogFile>', () => {
  it('renders correctly', () => {
    const component = (
      <AppOpenLogFile openLogFile={() => {}} />
    )

    expect(component).toBeTruthy()
  })

  it('matches snapshot', () => {
    const component = shallow((
      <AppOpenLogFile openLogFile={() => {}} />
    ))

    expect(component).toMatchSnapshot()

    const button = component.find('button')

    expect(button).toExist()
    expect(button).toHaveProp('onClick')
  })
})
