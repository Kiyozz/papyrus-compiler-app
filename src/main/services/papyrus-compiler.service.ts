interface GenerateCmdOptions {
  imports: string[]
  output: string
  exe: string
  scriptName: string
  flag: string
}

export class PapyrusCompilerService {
  generateCmd({ imports, output, exe, scriptName, flag }: GenerateCmdOptions): string {
    return `"${exe}" "${scriptName}" -i="${imports.join(';')}" -o="${output}" -f="${flag}"`
  }
}
