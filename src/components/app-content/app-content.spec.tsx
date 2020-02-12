import { shallow } from 'enzyme'
import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import AppContent from './app-content'

jest.mock('../../redux/sagas/root.saga', () => {
  return function* () {}
})

describe('<AppContent>', () => {
  it('renders correctly', () => {
    const component = (
      <AppContent />
    )

    expect(component).toBeTruthy()
  })

  it('matches snapshot', () => {
    const component = shallow((
      <AppContent />
    ))

    expect(component).toMatchSnapshot()

    const routes = component.find(Route)

    expect(routes).toHaveLength(3)
    expect(routes.at(0)).toHaveProp('path', '/compilation')
    expect(component.find(Switch)).toExist()
    expect(component.find(Redirect)).toExist()
  })
})
