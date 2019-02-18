import * as path from 'path';

class GamePathUtil {
  /**
   *
   * @param {{
   *  filenames: string[],
   *  imports: string,
   *  output: string,
   *  gamePath: string,
   * }} param0
   */
  constructor({ imports, output, gamePath, flag }) {
    this.imports = imports;
    this.output = output;
    this.gamePath = gamePath;
    this.flag = flag;
  }

  getImportFolder() {
    return path.join(this.gamePath, this.imports);
  }

  getGamePath() {
    return this.gamePath;
  }

  getOutputPath() {
    return path.join(this.gamePath, this.output);
  }

  getFlag() {
    return this.flag;
  }

  getPapyrusCompilerPath() {
    return path.resolve(this.gamePath, 'Papyrus Compiler');
  }

  getPapyrusCompilerExecutablePath() {
    return path.resolve(this.gamePath, 'Papyrus Compiler', 'PapyrusCompiler.exe');
  }
}

export default GamePathUtil;
