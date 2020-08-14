import { nodeResolve } from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'
import { terser } from 'rollup-plugin-terser'
import builtins from 'builtin-modules'
import fs from 'fs'
import path from 'path'

const extensions = ['.ts', '.tsx']
const dependencies = Object.keys(JSON.parse(fs.readFileSync(path.resolve(__dirname, 'package.json')).toString()).dependencies)

export default {
  input: './electron/main.ts',
  external: [...builtins, 'electron', ...dependencies],
  plugins: [
    nodeResolve({ extensions, preferBuiltins: true }),
    babel({
      extensions,
      exclude: ['node_modules'],
      babelHelpers: 'bundled'
    })
  ],
  output: [
    {
      file: 'build/main.js',
      format: 'cjs',
      plugins: [terser()]
    }
  ]
}
