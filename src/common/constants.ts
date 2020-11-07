import { is } from 'electron-util'

export const DEFAULT_COMPILER_PATH = `Papyrus Compiler${is.linux || is.macos ? '/' : '\\'}PapyrusCompiler.exe`
