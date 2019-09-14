import { src, dest, series } from 'gulp'
import del from 'del'
import { exec } from 'child_process'
import packager from 'electron-packager'

function clean() {
  return del(['./build'])
}

function cleanOut() {
  return del(['./out'])
}

function copyAssets() {
  return src(['package.json', 'yarn.lock'])
    .pipe(dest('./build'))
}

function install() {
  return exec('yarn install --prod', { cwd: './build' })
}

function buildReact() {
  return exec('npm run build', { cwd: __dirname })
}

function buildElectron() {
  return exec('npm run build:electron', { cwd: __dirname })
}

export function packageApp() {
  return packager({
    prune: true,
    asar: true,
    arch: 'x64',
    dir: './build',
    out: './out',
    icon: './src/assets/papyrus-compiler-app.ico'
  })
}

export const build = series(clean, buildReact, buildElectron, copyAssets, install)
const defaultTask = series(cleanOut, build, packageApp)

export default defaultTask
