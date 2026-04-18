import { defineConfig } from 'tsdown'
import babel from '@rolldown/plugin-babel'
import { lingui } from '@lingui/vite-plugin'

export default defineConfig({
  entry: [
    'src/main/main.ts',
    'src/main/preload.ts',
    'src/main/locales/**/messages.ts',
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
    lingui(),
    babel({
      plugins: [
        '@lingui/babel-plugin-lingui-macro',
        ['@babel/plugin-syntax-decorators', { version: '2023-11' }],
      ],
    }),
  ],
  define: {
    'process.env.ELECTRON_TELEMETRY_FEATURE': JSON.stringify(
      process.env.ELECTRON_TELEMETRY_FEATURE ?? '',
    ),
    'process.env.ELECTRON_TELEMETRY_API_KEY': JSON.stringify(
      process.env.ELECTRON_TELEMETRY_API_KEY ?? '',
    ),
    'process.env.ELECTRON_WEBPACK_APP_MOD_URL': JSON.stringify(
      process.env.ELECTRON_WEBPACK_APP_MOD_URL ??
        'https://www.nexusmods.com/skyrimspecialedition/mods/23852',
    ),
  },
})
