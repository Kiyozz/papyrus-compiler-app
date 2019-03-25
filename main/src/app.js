import * as childProcess from 'child_process';
import GamePathUtil from './gamepath-util';

class App {
  /**
   *
   * @param {GamePathUtil} gamePathUtil
   */
  constructor(gamePathUtil) {
    this.gamePathUtil = gamePathUtil;
  }

  /**
   *
   * @param {string} script
   *
   * @returns {Promise<string>}
   */
  compile(script) {
    return new Promise((resolve, reject) => {
      console.log('go compile register');
      const exe = this.gamePathUtil.getPapyrusCompilerExecutablePath();

      const cmd = `"${exe}" ${script} -i="${this.gamePathUtil.imports}" -o="${this.gamePathUtil.output}" -f="${this.gamePathUtil.getFlag()}"`;
      childProcess.exec(cmd, { cwd: this.gamePathUtil.getGamePath() }, (err, stdout, stderr) => {
        if (stderr) {
          reject(stderr.split('<unknown>').join('unknown'));

          return;
        }

        resolve(stdout);
      });
    });
  }
}

export default App;
