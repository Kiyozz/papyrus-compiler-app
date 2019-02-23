import { ipcMain } from 'electron';
import * as fs from 'fs-extra';
import * as path from 'path';
import GamePathUtil from './gamepath-util';
import App from './app';

export class EventHandler {
    register() {
        this.unregister();
        this.registerCompile();
        this.registerRequestScripts();
    }

    unregister() {
        if (this.compileSubscription) {
            this.compileSubscription.removeAllListeners('compile-script');
        }

        if (this.requestScriptsSubscription) {
            this.requestScriptsSubscription.removeAllListeners('request-scripts');
        }
    }

    registerCompile() {
        this.compileSubscription = ipcMain.on('compile-script', (event, { script, output, imports, flag, gamePath }) => {
            const gamePathUtil = new GamePathUtil({
                imports,
                output,
                gamePath,
                flag,
            });
            const appCompiler = new App(gamePathUtil);

            console.log('Compile ' + script);

            appCompiler.compile(script)
                .then(result => {
                    const isSuccess = /0 failed/.test(result + '');
                    if (isSuccess) {
                        console.log('Script ' + script + ' successfully compiled.');
                        event.sender.send('compile-success', result);
                    } else {
                        throw result;
                    }
                })
                .catch((e) => {
                    console.log('Script ' + script + ' failed to compile. "' + e + '"');
                    event.sender.send('compile-failed', e);
                });
        });
    }

    registerRequestScripts() {
        this.requestScriptsSubscription = ipcMain.on('request-scripts', (event, { importsFolder }) => {
            console.log('On request scripts');
            fs.pathExists(importsFolder, async (err, exists) => {
                if (err || !exists) {
                    event.sender.send('request-scripts-failed', { error: err, exists });

                    return false;
                }

                try {
                    const filesOrdered = await this.getFilesInDirOrdered(importsFolder, 100);

                    event.sender.send('request-scripts-success', filesOrdered);
                } catch (e) {
                    event.sender.send('request-scripts-failed', { error: err, exists });
                }
            })
        });
    }

    /**
     *
     * @param {string} dir
     * @param {number} max
     * @returns {Promise<string[]>}
     */
    getFilesInDirOrdered(dir, max) {
        return new Promise((resolve, reject) => {
            fs.readdir(dir, async (err, files) => {
                if (err) {
                    reject(err);

                    return false;
                }

                const filteredFiles = files.filter(file => {
                    return !/^(BYOH|DLC|DLc|FFS|FX|Fx|high|head|jail|magic|tg|trap|wc|we|whiterun|wi|mg|mq|ms|nealias|norl|pd|pf|pet|prkf|qf|sf|helgen|FreeForm|Freeform|Favor|FF|FFW|FFI|FNIS|FFR|FFM|FFH|DG|DRM|Arena|Altar|E3|Dra|Dwe|Dun|DRR|DRG|Dialogue|Default|Dawnstar|Dark|TIF_|C0|CC|CR|CW|Black|Bannered|DA|DB|DC|BQ|Car|Cid|Companion|Blade)/i.test(file) && !/.*tif.*/i.test(file);
                });

                const filesStats = await Promise.all(filteredFiles.map(async (file) => {
                    return {
                        file,
                        stat: await fs.stat(path.join(dir, file))
                    }
                }));

                let filesOrdered = filesStats.sort((fileA, fileB) => {
                    const { mtimeMs: mTimeA } = fileA.stat;
                    const { mtimeMs: mTimeB } = fileB.stat;

                    return mTimeB - mTimeA;
                });

                filesOrdered = filesOrdered.slice(0, max).map(file => {
                    return file.file.substr(0, file.file.length - 4);
                });

                resolve(filesOrdered);
            });
        })
    }
}