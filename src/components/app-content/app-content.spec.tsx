import React from 'react'
import { renderWithRedux } from '../../utils/testing/test-utils'
// import { Route, Switch, Redirect } from 'react-router-dom'
import AppContent from './app-content'

describe('<AppContent>', () => {
  it('renders correctly', () => {
    const component = (
      <AppContent />
    )

    expect(component).toBeTruthy()
  })

  it('should by compilation page by default', () => {
    const { getByText } = renderWithRedux(<AppContent />)

    expect(getByText(/Compilation/i)).toBeInTheDocument()
  })
})
