const path = require('path')
const del = require('del')
const readline = require('readline')
const childProcess = require('child_process')
const { promisify } = require('util')
const Spinners = require('cli-spinners')
const ora = require('ora')
const fs = require('fs-extra')
const packager = require('electron-packager')
const Seven = require('node-7z')
const zipBin = require('7zip-bin')
const args = require('yargs').argv

const exec = promisify(childProcess.exec)

const isBuild = typeof args.build !== 'undefined' ? args.build === true : true
const isPackage = typeof args.package !== 'undefined' && args.package === true
const isZip = typeof args.zip !== 'undefined' && args.zip === true

if (!isBuild && !isPackage && !isZip) {
  console.log('Nothing to do.')

  process.exit(0)
}

const SE_ZIP_NAME = 'papyrus-compiler-se'
const LE_ZIP_NAME = 'papyrus-compiler-le'
const PROJECT_DIR = path.join(__dirname, '..')
const PACKAGE_DIR = path.join(PROJECT_DIR, 'out')
const BUILD_DIR = path.join(PROJECT_DIR, 'build')
const BUILD_LE = 'build-le'
const BUILD_SE = 'build-se'
const BUILD_LE_DIR = path.join(PROJECT_DIR, BUILD_LE)
const BUILD_SE_DIR = path.join(PROJECT_DIR, BUILD_SE)

/**
 *
 * @param {string} filename
 * @param {string} destination
 * @return {Promise<unknown>}
 */
function zip(filename, destination) {
  const stream = Seven.add(path.resolve(PROJECT_DIR, `${filename}.7z`), '*', {
    $bin: zipBin.path7za,
    fullyQualifiedPaths: true,
    workingDir: PACKAGE_DIR,
    $progress: true,
    method: ['0=LZMA2'],
    noRootDuplication: true,
    $spawnOptions: { cwd: path.resolve(destination, 'papyrus-compiler-app-win32-x64') }
  })

  return new Promise(function (resolve, reject) {
    stream.on('end', function () {
      resolve()
    })

    stream.on('error', function (err) {
      reject(err)
    })
  })
}

/**
 * @param {string} icon
 * @param {string} folderSource
 * @return {Promise<string | string[]> | *}
 */
function packageApp(icon, folderSource) {
  return packager({
    prune: false,
    asar: true,
    arch: 'x64',
    dir: path.resolve(PROJECT_DIR, folderSource),
    out: path.resolve(PACKAGE_DIR, folderSource),
    icon,
    quiet: true
  })
}

/**
 *
 * @param {number} ms
 * @returns {Promise<void>}
 */
function wait(ms = 1000) {
  return new Promise(function (resolve) {
    setTimeout(resolve, ms)
  })
}

/**
 * Ask a question to the user
 *
 * @param {string} question
 * @returns {Promise<boolean>}
 */
function ask(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  return new Promise(function (resolve) {
    rl.question(`${question} (y/n): `, function (ans) {
      rl.close()

      if (ans === '' || ans === 'y') {
        resolve(true)
      } else {
        resolve(false)
      }
    })
  })
}

/**
 * @param {string} from
 * @param {string} to
 * @return {Promise<void>}
 */
function copy(from, to) {
  return fs.copy(from, to, { recursive: true })
}

/**
 * @param {string} from
 * @param {string} to
 * @return {Promise<void>}
 */
function move(from, to) {
  return fs.move(from, to, { overwrite: true })
}

async function clean() {
  const s = ora({ text: 'Clean builds', spinner: Spinners.simpleDotsScrolling }).start()

  try {
    await del(BUILD_DIR)
    await del(BUILD_LE)
    await del(BUILD_SE)
    await del(PACKAGE_DIR)
    await del(`${SE_ZIP_NAME}.7z`)
    await del(`${LE_ZIP_NAME}.7z`)

    s.succeed('Builds cleaned')
  } catch (e) {
    s.fail(e)
  }
}

async function build() {
  const s = ora({ text: 'Building main', spinner: Spinners.simpleDotsScrolling }).start()
  const sApp = ora({ indent: 1, spinner: Spinners.dots, text: 'Build' })

  await wait(400)

  try {
    s.text = 'Create Legendary Edition build'

    await exec('cross-env REACT_APP_NEXUS_PATH=https://www.nexusmods.com/skyrim/mods/96339?tab=files npm run build', {
      cwd: PROJECT_DIR
    })
    await move(BUILD_DIR, BUILD_LE_DIR)

    s.text = 'Create Special Edition build'

    await exec(
      'cross-env REACT_APP_NEXUS_PATH=https://www.nexusmods.com/skyrimspecialedition/mods/23852?tab=files npm run build',
      { cwd: PROJECT_DIR }
    )
    await move(BUILD_DIR, BUILD_SE_DIR)

    s.text = 'Create Main build'

    await wait(500)

    s.stop()
    sApp.start()

    await exec('npm run build:electron', { cwd: PROJECT_DIR })

    sApp.text = 'Assets'

    await copy(path.resolve(PROJECT_DIR, 'package.json'), path.resolve(BUILD_DIR, 'package.json'))

    await wait()

    await copy(path.resolve(PROJECT_DIR, 'yarn.lock'), path.resolve(BUILD_DIR, 'yarn.lock'))

    await wait()

    sApp.text = 'Dependencies'

    await exec('yarn install --prod', { cwd: BUILD_DIR })

    await wait()
    await del(path.join(BUILD_DIR, 'yarn.lock'))
    // await del(path.join(BUILD_DIR, 'package.json'))
    await copy(BUILD_DIR, BUILD_LE_DIR)
    await copy(BUILD_DIR, BUILD_SE_DIR)

    await del(BUILD_DIR)

    sApp.stop()

    s.start()
    s.succeed('Builds created')
  } catch (e) {
    sApp.stop()
    s.fail(e.message)
  }
}

async function packaging() {
  const s = ora({ text: 'Building Legendary Edition package', spinner: Spinners.simpleDotsScrolling }).start()

  try {
    const icon = path.resolve(PROJECT_DIR, 'src/assets/logo/app/icons/win/icon.ico')

    await packageApp(icon, BUILD_LE)

    s.text = 'Building Special Edition package'

    await packageApp(icon, BUILD_SE)

    s.succeed('Package builded')

    return true
  } catch (e) {
    s.fail(e.message)
  }
}

async function zipping() {
  const s = ora({ text: 'Building Legendary Edition zip', spinner: Spinners.simpleDotsScrolling }).start()

  try {
    await zip(LE_ZIP_NAME, path.resolve(PACKAGE_DIR, BUILD_LE))

    s.text = 'Building Special Edition zip'

    await zip(SE_ZIP_NAME, path.resolve(PACKAGE_DIR, BUILD_SE))

    s.succeed('Zips builded')
  } catch (e) {
    s.fail(e.message)
  }
}

async function start() {
  if (isBuild) {
    await clean()
    await build()
  }

  if (isPackage) {
    const done = await packaging()

    if (done && isZip) {
      await zipping()
    }
  }
}

start()
