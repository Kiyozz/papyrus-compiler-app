import React from 'react'
import { shallow } from 'enzyme'
import { CSSTransition } from 'react-transition-group'
import AppTaskLoading from './app-task-loading'

describe('<AppTaskLoading>', () => {
  it('renders correctly', () => {
    const component = (
      <AppTaskLoading loading={true} />
    )

    expect(component).toBeTruthy()
  })

  it('matches snapshot when not loading', () => {
    const component = shallow((
      <AppTaskLoading loading={false} />
    ))

    expect(component).toMatchSnapshot()
    expect(component.find(CSSTransition).prop('in')).toBe(false)
  })

  it('matches snapshot when loading', () => {
    const component = shallow((
      <AppTaskLoading loading={true} />
    ))

    expect(component).toMatchSnapshot()
    expect(component.find(CSSTransition).prop('in')).toBe(true)
  })
})
