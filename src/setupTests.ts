import '@testing-library/jest-dom'
import 'mutationobserver-shim'
import { mockElectronRequire, mockFontAwesome } from './utils/testing'

(global as any).MutationObserver = window.MutationObserver
mockFontAwesome()
const require = mockElectronRequire()

window.require = require
