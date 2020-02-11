import { shallow } from 'enzyme'
import React from 'react'
import { CSSTransition } from 'react-transition-group'
import AppSplashScreen from './app-splash-screen'

describe('<AppSplashScreen>', () => {
  it('renders correctly', () => {
    const component = (
      <AppSplashScreen initialized={true} />
    )

    expect(component).toBeTruthy()
  })

  it('matches snapshot when initialized', () => {
    const component = shallow((
      <AppSplashScreen initialized={true} />
    ))

    expect(component).toMatchSnapshot()

    const foundCSSTransition = component.find(CSSTransition)

    expect(foundCSSTransition.prop('in')).toBe(false)
    expect(foundCSSTransition.prop('mountOnEnter')).toBe(true)
    expect(foundCSSTransition.prop('unmountOnExit')).toBe(true)
  })

  it('matches snapshot when not initialized', () => {
    const component = shallow((
      <AppSplashScreen initialized={false} />
    ))

    expect(component).toMatchSnapshot()

    const foundCSSTransition = component.find(CSSTransition)

    expect(foundCSSTransition.prop('in')).toBe(true)
    expect(foundCSSTransition.prop('mountOnEnter')).toBe(true)
    expect(foundCSSTransition.prop('unmountOnExit')).toBe(true)
  })
})
