export class CompileScriptException extends Error {
  constructor(script: string, err: string, cmd?: string) {
    const removedString = `Script ${script} failed to compile: `

    super(JSON.stringify({
      script,
      command: cmd,
      error: err.replace(removedString, '')
    }))
  }
}
