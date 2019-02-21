const { exec } = require('child_process');
const packager = require('electron-packager');
const path = require('path');
const fs = require('fs-extra');
const escape = require('escape-string-regexp');
const colors = require('colors/safe');
const babel = require('@babel/core');

const outDir = path.join(__dirname, 'out');
const srcDir = path.join(__dirname, 'main');
const appDir = path.join(__dirname, 'app');
const packagedDir = path.join(__dirname, 'packaged');
const angularAppDir = path.join(appDir, 'papyrus-compiler-app');
const packageJsonFile = path.join(__dirname, 'package.json');
const packageLockJsonFile = path.join(__dirname, 'yarn.lock');
const packageJsonFileOutDir = path.join(outDir, 'package.json');
const packageLockJsonFileOutDir = path.join(outDir, 'yarn.lock');
const electronSourcesFile = path.join(__dirname, 'electron-sources.json');

function execAsync(...args) {
    return new Promise((resolve, reject) => {
        exec(...args, (err, stdout) => {
            if (err) {
                reject(err);

                return;
            }

            resolve(stdout);
        });
    });
}

function filterFilesNotToCopy(src, dest) {
    const regex = new RegExp('^.*node_modules.*$');
    const regexApp = new RegExp('^' + escape(appDir) + '$');

    if (!regex.test(src) && !regexApp.test(src)) {
        return true;
    }

    return false;
}

async function compileElectronSource() {
    const { files } = await fs.readJson(electronSourcesFile);

    const iterable = Object.entries(files).map(objArray => {
        return objArray.map(obj => path.join(__dirname, obj));
    });

    for (const [src, dest] of iterable) {
        const { code } = await babel.transformFileAsync(src);
        await fs.writeFile(dest, code);
    }
}

const bootstrap = async () => {
    try {
        console.log(colors.blue('Build Angular application'));

        const stdout = await execAsync('yarn build-electron', { cwd: angularAppDir });

        console.log(stdout);
        console.log(colors.blue('Copying source files...'));

        await fs.copy(srcDir, outDir, { filter: filterFilesNotToCopy });
        await fs.copy(packageJsonFile, packageJsonFileOutDir);
        await fs.copy(packageLockJsonFile, packageLockJsonFileOutDir);

        const json = await fs.readJson(packageJsonFileOutDir);

        json.main = 'index.js';

        await fs.writeFile(packageJsonFileOutDir, JSON.stringify(json));
        await compileElectronSource();

        const stdoutYarn = await execAsync('yarn install --production', { cwd: outDir });

        console.log(stdoutYarn);
        console.log("\n\n" + colors.green('Done copying source files'));

        await fs.ensureDir(packagedDir);
        await packager({
            name: 'papyrus-compiler-app',
            icon: path.join(srcDir, 'papyrus-compiler-app.ico'),
            dir: outDir,
            out: packagedDir,
            platform: 'win32',
            arch: 'ia32',
            asar: true,
            overwrite: true,
        });

        console.log(colors.green('Done packaging app'));
    } catch (e) {
        console.error(colors.red('Error during packaging.'));
        console.error(e);
        process.exit(1);
    }
};

bootstrap();
