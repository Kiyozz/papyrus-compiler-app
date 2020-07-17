const { src, dest, series } = require('gulp')
const path = require('path')
const del = require('del')
const { exec, spawn } = require('child_process')
const packager = require('electron-packager')
const Seven = require('node-7z')
const zipBin = require('7zip-bin')

function clean() {
  return del(['./build'])
}

function cleanLe() {
  return del('./build-le')
}

function cleanSe() {
  return del('./build-se')
}

function cleanOut() {
  return del(['./out'])
}

function cleanZips(zip) {
  const cleanZip = function cleanZip() {
    return del([`./${zip}.7z`])
  }

  Object.defineProperty(cleanZip, 'name', { value: `Clean ${zip}.7z`, writable: false })

  return cleanZip
}

function copyAssets(destination) {
  const copy = function copy() {
    return src(['package.json', 'yarn.lock']).pipe(dest(destination))
  }

  Object.defineProperty(copy, 'name', { value: `Copy assets to ${destination}`, writable: false })

  return copy
}

function install() {
  return exec('yarn install --prod', { cwd: './build' })
}

function buildReactSe() {
  return exec('cross-env REACT_APP_NEXUS_PATH=https://www.nexusmods.com/skyrimspecialedition/mods/23852?tab=files npm run build', { cwd: __dirname })
}

/**
 *
 * @param {string} destination
 */
function moveBuild(destination) {
  const move = function move() {
    return src(['build/**']).pipe(dest(destination))
  }

  Object.defineProperty(move, 'name', { value: `Move build to ${destination}`, writable: false })

  return move
}

function buildReactLe() {
  return exec('cross-env REACT_APP_NEXUS_PATH=https://www.nexusmods.com/skyrim/mods/96339?tab=files npm run build', { cwd: __dirname })
}

function buildElectron() {
  return exec('npm run build:electron', { cwd: __dirname })
}

function packageApp(from) {
  const packagingApp = function() {
    return packager({
      prune: true,
      asar: true,
      arch: 'x64',
      dir: from,
      out: `./out/${from}`,
      icon: './src/assets/logo/app/icons/win/icon.ico'
    })
  }

  Object.defineProperty(packagingApp, 'name', { value: `Packaging ${from}`, writable: false })

  return packagingApp
}

function zipPackage(from, name) {
  const zip = function zip() {
    return Seven.add(
      path.resolve(__dirname, `${name}.7z`),
      '*',
      {
        $bin: zipBin.path7za,
        fullyQualifiedPaths: true,
        workingDir: '..',
        $progress: true,
        method: ['0=LZMA2'],
        noRootDuplication: true,
        $spawnOptions: { cwd: path.resolve(__dirname, 'out', from, 'papyrus-compiler-app-win32-x64') }
      }
    )
  }

  Object.defineProperty(zip, 'name', { value: `Zip ${from} - ${name}`, writable: false })

  return zip
}

const build = series(
  clean,
  cleanSe,
  cleanLe,
  buildReactLe,
  moveBuild('build-le'),
  clean,
  buildReactSe,
  moveBuild('build-se'),
  clean,
  buildElectron,
  copyAssets('./build'),
  install,
  moveBuild('build-le'),
  moveBuild('build-se')
)

const zipLe = series(cleanZips('papyrus-compiler-app-le'), zipPackage('build-le', 'papyrus-compiler-app-le'))
const zipSe = series(cleanZips('papyrus-compiler-app-se'), zipPackage('build-se', 'papyrus-compiler-app-se'))

const defaultTask = series(cleanOut, build, packageApp('build-le'), packageApp('build-se'), zipLe, zipSe)

module.exports = {
  build,
  default: defaultTask,
  buildReactLe: series(buildReactLe, moveBuild('build-le')),
  buildReactSe: series(buildReactSe, moveBuild('build-se')),
  clean: series(clean, cleanLe, cleanSe),
  buildElectronLe: series(buildElectron, copyAssets('build'), install, moveBuild('build-le')),
  'packageSe': packageApp('build-se'),
  'packageLe': packageApp('build-le'),
  'zip-le': zipLe,
  'zip-se': zipSe
}
