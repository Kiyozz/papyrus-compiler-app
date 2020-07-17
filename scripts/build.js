const path = require('path')
const del = require('del')
const readline = require('readline')
const { exec } = require('child-process-promise')
const Spinners = require('cli-spinners')
const ora = require('ora')
const fs = require('fs-extra')
const packager = require('electron-packager')
const Seven = require('node-7z')
const zipBin = require('7zip-bin')

const PROJECT_DIR = path.resolve(__dirname, '..')
const PACKAGE_DIR = path.resolve(PROJECT_DIR, 'out')
const BUILD_DIR = path.resolve(PROJECT_DIR, 'build')
const BUILD_LE_DIR = path.resolve(PROJECT_DIR, 'build-le')
const BUILD_SE_DIR = path.resolve(PROJECT_DIR, 'build-se')

async function clean() {
  const s = ora({ text: 'Clean builds', spinner: Spinners.simpleDotsScrolling }).start()

  try {
    await del('./build')
    await del('./build-le')
    await del('./build-se')

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

    // await exec('cross-env REACT_APP_NEXUS_PATH=https://www.nexusmods.com/skyrim/mods/96339?tab=files npm run build', { cwd: PROJECT_DIR })
    // await move(BUILD_DIR, BUILD_LE_DIR)

    s.text = 'Create Special Edition build'

    // await exec('cross-env REACT_APP_NEXUS_PATH=https://www.nexusmods.com/skyrimspecialedition/mods/23852?tab=files npm run build', { cwd: PROJECT_DIR })
    // await move(BUILD_DIR, BUILD_SE_DIR)

    s.text = 'Create Main build'

    s.stop()
    sApp.start()

    await exec('npm run build:electron', { cwd: PROJECT_DIR })

    sApp.text = 'Assets'

    await copy(path.resolve(PROJECT_DIR, 'package.json'), path.resolve(BUILD_DIR, 'package.json'))
    await copy(path.resolve(PROJECT_DIR, 'yarn.lock'), path.resolve(BUILD_DIR, 'yarn.lock'))

    sApp.text = 'Dependencies'

    await exec('yarn install --prod', { cwd: BUILD_DIR })

    await wait()
    await copy(BUILD_DIR, BUILD_LE_DIR)
    await move(BUILD_DIR, BUILD_SE_DIR)

    sApp.stop()

    s.start()
    s.succeed('Builds created')
  } catch (e) {
    sApp.stop()
    s.fail(e.message)
  }
}

async function packaging() {
  const response = await ask('Package the builds?')

  if (response) {
    const s = ora({ text: 'Building Legendary Edition package', spinner: Spinners.simpleDotsScrolling }).start()

    try {
      await packageBuild(BUILD_LE_DIR)

      s.text = 'Building Special Edition package'

      await packageBuild(BUILD_SE_DIR)

      s.succeed('Package builded')
    } catch (e) {
      s.fail(e.message)
    }
  }
}

async function zipping() {
  const response = await ask('Zip the packages?')

  if (response) {
    const s = ora({ text: 'Building Legendary Edition zip', spinner: Spinners.simpleDotsScrolling }).start()

    try {
      await zipFolder(path.resolve(PACKAGE_DIR, 'build-le'), 'papyrus-compiler-le')

      s.text = 'Building Special Edition zip'

      await zipFolder(path.resolve(PACKAGE_DIR, 'build-se'), 'papyrus-compiler-se')

      s.succeed('Zips builded')
    } catch (e) {
      s.fail(e.message)
    }
  }
}

async function start() {
  await clean()
  await build()
  await packaging()
  await zipping()
}

/**
 *
 * @param {string} from
 * @param {string} to
 * @return {Promise<void>}
 */
async function copy(from, to) {
  return fs.copy(from, to, { recursive: true })
}

/**
 *
 * @param {string} from
 * @param {string} to
 * @return {Promise<void>}
 */
async function move(from, to) {
  return fs.move(from, to, { overwrite: true })
}

function wait(ms = 1000) {
  return new Promise(function(resolve) {
    setTimeout(resolve, ms)
  })
}

function packageBuild(from) {
  return packager({
    prune: true,
    asar: true,
    arch: 'x64',
    dir: from,
    out: PACKAGE_DIR,
    icon: path.resolve(PROJECT_DIR, 'src/assets/logo/app/icons/win/icon.ico'),
    quiet: true
  })
}

function zipFolder(folder, name) {
  const stream = Seven.add(
    path.resolve(PROJECT_DIR, `${name}.7z`),
    '*',
    {
      $bin: zipBin.path7za,
      fullyQualifiedPaths: true,
      workingDir: '..',
      $progress: true,
      method: ['0=LZMA2'],
      noRootDuplication: true,
      $spawnOptions: { cwd: path.resolve(folder, 'papyrus-compiler-app-win32-x64') }
    }
  )

  return new Promise(function (resolve, reject) {
    stream.on('end', function() {
      resolve()
    })

    stream.on('error', function(err) {
      reject(err)
    })
  })
}

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

start()
