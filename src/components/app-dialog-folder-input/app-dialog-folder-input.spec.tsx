import React from 'react'
import { buildProps, render, fireEventChange } from '../../utils/testing'
import AppDialogFolderInput, { Props } from './app-dialog-folder-input'

const props = buildProps<Props>({
  id: '1',
  name: 'toto',
  value: 'tata',
  onChange: jest.fn()
})

describe('<AppDialogFolderInput>', () => {
  it('renders correctly', () => {
    const component = (
      <AppDialogFolderInput {...props()} />
    )

    expect(component).toBeTruthy()
  })

  it('have an input', () => {
    const { querySelector } = render(<AppDialogFolderInput {...props()} />)

    expect(querySelector('input')).not.toBeNull()
  })

  it('should call onChange prop', () => {
    const componentProps = props()
    const { getBySelector } = render(<AppDialogFolderInput {...componentProps} />)
    const input = getBySelector('input') as HTMLInputElement

    fireEventChange(input, 'tataa')
    expect(componentProps.onChange).toHaveBeenCalled()
  })
})
