const { src, dest, series } = require('gulp')
const del = require('del')
const { exec } = require('child_process')
const packager = require('electron-packager')

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

function packageApp() {
  return packager({
    prune: true,
    asar: true,
    arch: 'x64',
    dir: './build',
    out: './out',
    icon: './src/assets/papyrus-compiler-app.ico'
  })
}

const build = series(clean, buildReact, buildElectron, copyAssets, install)
const defaultTask = series(cleanOut, build, packageApp)

module.exports = {
  build,
  default: defaultTask,
  'package-app': packageApp,
  clean,
  'clean-out': cleanOut,
  'build-react': buildReact,
  'build-electron': buildElectron,
  'copy-assets': copyAssets,
  install
}
