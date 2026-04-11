import { defineConfig } from 'tsdown'
import babel from '@rolldown/plugin-babel'
import { defineRolldownBabelPreset } from '@rolldown/plugin-babel'

const linguiPreset = defineRolldownBabelPreset({
  preset: () => ({ plugins: ['@lingui/babel-plugin-lingui-macro'] }),
  rolldown: {
    filter: {
      code: /from ['"]@lingui\/(?:react|core)\/macro['"]/,
    },
  },
})

export default defineConfig({
  entry: [
    'src/main/main.ts',
    'src/main/preload.ts',
    'src/main/locales/**/messages.js',
  ],
  platform: 'node',
  format: 'esm',
  target: 'node24.14', // electron version target
  logLevel: 'error',
  outDir: 'dist/main',
  unbundle: true,
  deps: {
    skipNodeModulesBundle: true,
  },
  plugins: [
    babel({
      presets: [linguiPreset],
    }),
  ],
})
