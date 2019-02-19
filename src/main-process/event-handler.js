import { ipcMain } from 'electron';
import GamePathUtil from './gamepath-util';
import AppCompiler from './app-compiler';

export class EventHandler {
    register() {
        this.unregister();
        this.ipcMain = ipcMain.on('compile-script', (event, { script, output, imports, flag, gamePath }) => {
            const gamePathUtil = new GamePathUtil({
                imports,
                output,
                gamePath,
                flag,
            });
            const appCompiler = new AppCompiler(gamePathUtil);

            console.log('Compile ' + script);

            appCompiler.compile(script)
                .then(result => {
                    console.log('good ' + script + "\n\n");
                    console.log(JSON.stringify(result));
                    event.sender.send('compile-success', result);
                })
                .catch((e) => {
                    console.log('error ' + script + ' ---------- ' + JSON.stringify(e));
                    event.sender.send('compile-failed', e);
                });
        });
    }

    unregister() {
        if (this.ipcMain) {
            this.ipcMain.removeAllListeners('compile-script');
        }
    }
}