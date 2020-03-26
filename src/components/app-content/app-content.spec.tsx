import React from 'react'
import { renderWithRedux } from '../../utils/testing'
import AppContent from './app-content'

describe('<AppContent>', () => {
  it('renders correctly', () => {
    const component = (
      <AppContent />
    )

    expect(component).toBeTruthy()
  })

  it('should be on compilation page by default', () => {
    const { container } = renderWithRedux(<AppContent />)

    expect(container.querySelector('h1')).toHaveTextContent('Compilation')
  })

  it('should be on groups page on /groups', () => {
    const { container, history } = renderWithRedux(<AppContent />)

    history.push('/groups')

    expect(container.querySelector('h1')).toHaveTextContent('Groups')
  })

  it('should be on settings page on /settings', () => {
    const { container, history } = renderWithRedux(<AppContent />)

    history.push('/settings')

    expect(container.querySelector('h1')).toHaveTextContent('Settings')
  })

  it('should be on compilation page when not found', () => {
    const { container, history } = renderWithRedux(<AppContent />)

    history.push('/not-found-page')

    expect(container.querySelector('h1')).toHaveTextContent('Compilation')
  })
})
