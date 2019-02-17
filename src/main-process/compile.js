import * as Compiler from '../app/papyrus-compiler-binary/src/compile';
import * as GamePathUtil from '../app/papyrus-compiler-binary/src/gamepath-util';

class AppCompiler {
  constructor() {
    this.compile = this.compile.bind(this);
  }

  /**
   *
   * @param {string} script
   * @param {string} flag
   * @param {string} imports
   * @param {string} output
   * @param {string} gamePath
   *
   * @returns {Promise<Buffer[]>}
   */
  async compile({ script, flag, imports, output, gamePath }) {
    const gamePathUtil = new GamePathUtil({
      cliArgs: true,
      flag,
      imports,
      output,
      gamePath,
    });

    const compiler = new Compiler({
      filenames: [script],
      gamePathUtil,
    });

    console.log('go compile');
    const result = await compiler.compileAll();

    if (typeof result === 'string') {
      console.log('failed');

      throw new Error(result);
    }

    console.log('success');

    return result;
  }
}

exports.AppCompiler = AppCompiler;
