import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel'
import json from '@rollup/plugin-json'

const extensions = [
  '.js', '.jsx', '.ts', '.tsx',
];

export default {
  input: './electron/main.ts',

  // Specify here external modules which you don't want to include in your bundle (for instance: 'lodash', 'moment' etc.)
  // https://rollupjs.org/guide/en/#external
  external: [],

  plugins: [
    // Allows node_modules resolution
    resolve({ extensions: [...extensions, '.json'], preferBuiltins: true }),
    json(),

    // Allow bundling cjs modules. Rollup doesn't understand cjs
    commonjs(),

    // Compile TypeScript/JavaScript files
    babel({
      extensions,
      exclude: ['node_modules'],
      babelHelpers: 'bundled',
      include: ['electron/**/*.ts'],
      minified: true
    }),
  ],

  output: [{
    file: 'electron/test-r/main.js',
    format: 'cjs',
  }],
};
