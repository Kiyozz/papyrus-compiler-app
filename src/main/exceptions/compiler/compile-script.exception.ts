export class CompileScriptException extends Error {
  constructor(script: string, err: string, cmd?: string) {
    const removedString = `Script ${script} failed to compile: `

    super(
      `${removedString}${err.replace(removedString, '')}${
        typeof cmd !== 'undefined' ? `\nExecuted command was : ${cmd}` : ''
      }`
    )
  }
}
