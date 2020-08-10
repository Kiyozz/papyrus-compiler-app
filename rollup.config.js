import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'
import { terser } from 'rollup-plugin-terser'
import builtins from 'builtin-modules'

const extensions = ['.js', '.jsx', '.ts', '.tsx']

export default {
  input: './electron/main.ts',
  external: [...builtins],
  plugins: [
    nodeResolve({ extensions, preferBuiltins: true }),
    commonjs(),
    babel({
      extensions,
      exclude: ['node_modules'],
      babelHelpers: 'bundled',
      include: ['electron/**/*.ts']
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
