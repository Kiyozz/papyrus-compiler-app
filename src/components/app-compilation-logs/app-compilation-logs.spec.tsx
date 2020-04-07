import React from 'react'
import { render, fireEvent, buildProps } from '../../utils/testing'
import AppCompilationLogs, { Props } from './app-compilation-logs'

const props = buildProps<Props>({
  logs: [],
  popupOpen: false,
  popupToggle: jest.fn()
})

describe('<AppCompilationLogs>', () => {
  it('renders correctly', () => {
    expect(<AppCompilationLogs {...props()} />).toBeTruthy()
  })

  it('should be close by default', () => {
    const { querySelector } = render(<AppCompilationLogs {...props()} />)

    expect(querySelector('button > svg')).not.toBeNull()
  })

  it('can open with a button', () => {
    const componentProps = props()
    const { getBySelector } = render(<AppCompilationLogs {...componentProps} />)

    const buttonActivate = getBySelector('.app-compilation-logs > button')

    fireEvent.click(buttonActivate)

    expect(componentProps.popupToggle).toHaveBeenCalledWith(true)
  })

  it('can close with a button', () => {
    const componentProps = props({ popupOpen: true })
    const { getBySelector } = render(<AppCompilationLogs {...componentProps} />)

    const buttonActivate = getBySelector('.app-compilation-logs > div button')

    fireEvent.click(buttonActivate)

    expect(componentProps.popupToggle).toHaveBeenCalledWith(false)
  })
})
