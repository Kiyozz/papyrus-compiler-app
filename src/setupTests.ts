import '@testing-library/jest-dom'
import 'mutationobserver-shim'
import { mockElectronRequire, mockFontAwesome } from './utils/testing/test-utils'

(global as any).MutationObserver = window.MutationObserver
mockFontAwesome()
const require = mockElectronRequire()

window.require = require
