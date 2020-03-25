import React from 'react'
import { renderWithRedux } from '../../utils/testing/test-utils'
import AppContent from './app-content'

describe('<AppContent>', () => {
  it('renders correctly', () => {
    const component = (
      <AppContent />
    )

    expect(component).toBeTruthy()
  })

  it('should have compilation page by default', () => {
    const { container } = renderWithRedux(<AppContent />)

    expect(container.querySelector('h1')).toHaveTextContent('Compilation')
  })

  it('should be groups page on /groups', () => {
    const { container, history } = renderWithRedux(<AppContent />)

    history.push('/groups')

    expect(container.querySelector('h1')).toHaveTextContent('Groups')
  })
})
