import * as childProcess from 'child_process';
import GamePathUtil from './gamepath-util';

class AppCompiler {
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
   * @returns {Promise<Buffer[]>}
   */
  compile(script) {
    return new Promise((resolve, reject) => {
      console.log('go compile register');
      const exe = this.gamePathUtil.getPapyrusCompilerExecutablePath();

      const cmd = `"${exe}" ${script} -i="${this.gamePathUtil.imports}" -o="${this.gamePathUtil.output}" -f="${this.gamePathUtil.getFlag()}"`
      childProcess.exec(cmd, { cwd: this.gamePathUtil.getGamePath() }, (err, stdout, stderr) => {
        if (stderr) {
          reject(stderr);

          return;
        }

        resolve(stdout);
      });
    })
  }
}

export default AppCompiler;
