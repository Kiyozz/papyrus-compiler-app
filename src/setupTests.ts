import '@testing-library/jest-dom'
import 'mutationobserver-shim'
import { mockElectronRequire } from './utils/testing'

(global as any).MutationObserver = window.MutationObserver
const require = mockElectronRequire()

window.require = require
