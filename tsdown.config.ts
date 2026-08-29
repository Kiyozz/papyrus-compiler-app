import { readFileSync } from 'node:fs'
import { defineConfig } from 'tsdown'
import babel from '@rolldown/plugin-babel'
import { linguiTransformerBabelPreset } from '@lingui/vite-plugin'
import { MOD_URL_DEFAULT } from './src/common/env.ts'

const pkg = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url), 'utf8'),
) as { publicVersion: string }

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
    babel({
      presets: [
        linguiTransformerBabelPreset(
          {},
          { configPath: './lingui.main.config.ts' },
        ),
      ],
      plugins: [['@babel/plugin-syntax-decorators', { version: '2023-11' }]],
    }),
  ],
  define: {
    __PUBLIC_VERSION__: JSON.stringify(pkg.publicVersion),
    'process.env.PCA_TELEMETRY_ENABLED': JSON.stringify(
      process.env.PCA_TELEMETRY_ENABLED ?? 'false',
    ),
    'process.env.PCA_TELEMETRY_API_URL': JSON.stringify(
      process.env.PCA_TELEMETRY_API_URL ?? '',
    ),
    'process.env.PCA_TELEMETRY_API_KEY': JSON.stringify(
      process.env.PCA_TELEMETRY_API_KEY ?? '',
    ),
    'process.env.PCA_MOD_URL': JSON.stringify(
      process.env.PCA_MOD_URL ?? MOD_URL_DEFAULT,
    ),
  },
})
