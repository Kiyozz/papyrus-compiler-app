import { shallow } from 'enzyme'
import React from 'react'
import { NavLink } from 'react-router-dom'
import AppSidebarLink from './app-sidebar-link'

describe('<AppSidebarLink>', () => {
  it('renders correctly', () => {
    const component = (
      <AppSidebarLink to="/toto" />
    )

    expect(component).toBeTruthy()
  })

  it('matches snapshot when no exact', () => {
    const component = shallow((
      <AppSidebarLink to="/toto" />
    ))

    expect(component).toMatchSnapshot()

    const navLink = component.find(NavLink)

    expect(navLink).toHaveLength(1)
    expect(navLink.prop('to')).toBe('/toto')
    expect(navLink.prop('exact')).toBe(undefined)
  })

  it('matches snapshot when exact', () => {
    const component = shallow((
      <AppSidebarLink to="/tata" exact />
    ))

    expect(component).toMatchSnapshot()

    const navLink = component.find(NavLink)

    expect(navLink).toHaveLength(1)
    expect(navLink.prop('to')).toBe('/tata')
    expect(navLink.prop('exact')).toBe(true)
  })
})
