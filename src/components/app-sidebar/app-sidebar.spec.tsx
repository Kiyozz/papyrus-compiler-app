import { shallow } from 'enzyme'
import React from 'react'
import AppSidebarLink from '../app-sidebar-link/app-sidebar-link'
import AppSidebar from './app-sidebar'

describe('<AppSidebar>', () => {
  it('renders correctly', () => {
    const component = (
      <AppSidebar />
    )

    expect(component).toBeTruthy()
  })

  it('matches snapshot', () => {
    const component = shallow((
      <AppSidebar />
    ))

    expect(component).toMatchSnapshot()
    expect(component.find(AppSidebarLink)).toHaveLength(3)
  })
})
