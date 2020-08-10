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

const isSkipBuild = typeof args.skipBuild !== 'undefined'

const PROJECT_DIR = path.join(__dirname, '..')
const PACKAGE_DIR = path.join(PROJECT_DIR, 'out')
const BUILD_DIR = path.join(PROJECT_DIR, 'build')
const BUILD_LE = 'build-le'
const BUILD_SE = 'build-se'
const BUILD_LE_DIR = path.join(PROJECT_DIR, BUILD_LE)
const BUILD_SE_DIR = path.join(PROJECT_DIR, BUILD_SE)

class FileHandler {
  /**
   *
   * @param {string} from
   * @param {string} to
   * @return {Promise<void>}
   */
  async move(from, to) {
    return fs.move(from, to, { overwrite: true })
  }

  /**
   *
   * @param {string} from
   * @param {string} to
   * @return {Promise<void>}
   */
  async copy(from, to) {
    return fs.copy(from, to, { recursive: true })
  }
}

class Util {
  /**
   *
   * @param {number} ms
   * @returns {Promise<void>}
   */
  async wait(ms = 1000) {
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
  ask(question) {
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
}

class Packager {
  /**
   *
   * @param {string} icon
   * @param {string} projectDir
   * @param {string} packageDir
   */
  constructor(icon, projectDir, packageDir) {
    this.projectDir = projectDir
    this.packageDir = packageDir
    this.icon = icon
  }

  package(folderSource) {
    return packager({
      prune: false,
      asar: true,
      arch: 'x64',
      dir: path.resolve(this.projectDir, folderSource),
      out: path.resolve(this.packageDir, folderSource),
      icon: this.icon,
      quiet: true
    })
  }
}

class ZipCreator {
  /**
   *
   * @param {string} projectDir
   * @param {string} workingDir
   */
  constructor(projectDir, workingDir) {
    this.projectDir = projectDir
    this.workingDir = workingDir
  }

  /**
   *
   * @param {string} filename
   * @param {string} destination
   * @returns {Promise<void>}
   */
  start(filename, destination) {
    const stream = Seven.add(path.resolve(this.projectDir, `${filename}.7z`), '*', {
      $bin: zipBin.path7za,
      fullyQualifiedPaths: true,
      workingDir: this.workingDir,
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
}

class Build {
  /**
   *
   * @param {ZipCreator} zipCreator
   * @param {Packager} packager
   * @param {Util} util
   * @param {FileHandler} fileHandler
   * @param {string} projectDir
   * @param {string} packageDir
   * @param {string} buildDir
   * @param {string} buildLeDir
   * @param {string} buildSeDir
   * @param {string} buildLe
   * @param {string} buildSe
   */
  constructor(
    zipCreator,
    packager,
    util,
    fileHandler,
    projectDir,
    packageDir,
    buildDir,
    buildLeDir,
    buildSeDir,
    buildLe,
    buildSe
  ) {
    this.zipCreator = zipCreator
    this.packager = packager
    this.util = util
    this.fileHandler = fileHandler
    this.projectDir = projectDir
    this.packageDir = packageDir
    this.buildDir = buildDir
    this.buildLeDir = buildLeDir
    this.buildSeDir = buildSeDir
    this.buildSe = buildSe
    this.buildLe = buildLe
  }

  async start() {
    if (!isSkipBuild) {
      await this.clean()
      await this.build()
    }

    const done = await this.packaging()

    if (done) {
      await this.zipping()
    }
  }

  async clean() {
    const s = ora({ text: 'Clean builds', spinner: Spinners.simpleDotsScrolling }).start()

    try {
      await del('./build')
      await del('./build-le')
      await del('./build-se')
      await del('./out')
      await del('./papyrus-compiler-se.7z')
      await del('./papyrus-compiler-le.7z')

      s.succeed('Builds cleaned')
    } catch (e) {
      s.fail(e)
    }
  }

  async build() {
    const s = ora({ text: 'Building main', spinner: Spinners.simpleDotsScrolling }).start()
    const sApp = ora({ indent: 1, spinner: Spinners.dots, text: 'Build' })

    await this.util.wait(400)

    try {
      s.text = 'Create Legendary Edition build'

      await exec('cross-env REACT_APP_NEXUS_PATH=https://www.nexusmods.com/skyrim/mods/96339?tab=files npm run build', {
        cwd: this.projectDir
      })
      await this.fileHandler.move(this.buildDir, this.buildLeDir)

      s.text = 'Create Special Edition build'

      await exec(
        'cross-env REACT_APP_NEXUS_PATH=https://www.nexusmods.com/skyrimspecialedition/mods/23852?tab=files npm run build',
        { cwd: this.projectDir }
      )
      await this.fileHandler.move(this.buildDir, this.buildSeDir)

      s.text = 'Create Main build'

      await this.util.wait(500)

      s.stop()
      sApp.start()

      await exec('npm run build:electron', { cwd: this.projectDir })

      sApp.text = 'Assets'

      await this.fileHandler.copy(
        path.resolve(this.projectDir, 'package.json'),
        path.resolve(this.buildDir, 'package.json')
      )

      await this.util.wait()

      await this.fileHandler.copy(path.resolve(this.projectDir, 'yarn.lock'), path.resolve(this.buildDir, 'yarn.lock'))

      await this.util.wait()

      sApp.text = 'Dependencies'

      await exec('yarn install --prod', { cwd: this.buildDir })

      await this.util.wait()
      await del(path.join(this.buildDir, 'yarn.lock'))
      await del(path.join(this.buildDir, 'package.json'))
      await this.fileHandler.copy(this.buildDir, this.buildLeDir)
      await this.fileHandler.copy(this.buildDir, this.buildSeDir)

      await del(this.buildDir)

      sApp.stop()

      s.start()
      s.succeed('Builds created')
    } catch (e) {
      sApp.stop()
      s.fail(e.message)
    }
  }

  async packaging() {
    const response = await this.util.ask('Package the builds?')

    if (!response) {
      return false
    }

    const s = ora({ text: 'Building Legendary Edition package', spinner: Spinners.simpleDotsScrolling }).start()

    try {
      await this.packager.package(this.buildLe)

      s.text = 'Building Special Edition package'

      await this.packager.package(this.buildSe)

      s.succeed('Package builded')

      return true
    } catch (e) {
      s.fail(e.message)
    }
  }

  async zipping() {
    const response = await this.util.ask('Zip the packages?')

    if (response) {
      const s = ora({ text: 'Building Legendary Edition zip', spinner: Spinners.simpleDotsScrolling }).start()

      try {
        await this.zipCreator.start('papyrus-compiler-le', path.resolve(this.packageDir, 'build-le'))

        s.text = 'Building Special Edition zip'

        await this.zipCreator.start('papyrus-compiler-se', path.resolve(this.packageDir, 'build-se'))

        s.succeed('Zips builded')
      } catch (e) {
        s.fail(e.message)
      }
    }
  }
}

const builder = new Build(
  new ZipCreator(PROJECT_DIR, PACKAGE_DIR),
  new Packager(path.resolve(PROJECT_DIR, 'src/assets/logo/app/icons/win/icon.ico'), PROJECT_DIR, PACKAGE_DIR),
  new Util(),
  new FileHandler(),
  PROJECT_DIR,
  PACKAGE_DIR,
  BUILD_DIR,
  BUILD_LE_DIR,
  BUILD_SE_DIR,
  BUILD_LE,
  BUILD_SE
)

builder.start()
