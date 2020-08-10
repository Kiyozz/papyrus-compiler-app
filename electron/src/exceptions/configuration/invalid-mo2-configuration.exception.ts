export class InvalidMo2ConfigurationException extends Error {
  constructor(params: readonly any[]) {
    if (params.length === 0) {
      throw new TypeError('Params cannot be empty.')
    }

    const lastParam = params[params.length - 1]
    const otherParams = params.slice(0, params.length - 1)

    super(`Missing parameters: ${otherParams.join(', ')}${lastParam ? ` or ${lastParam}` : ''}`)
  }
}
