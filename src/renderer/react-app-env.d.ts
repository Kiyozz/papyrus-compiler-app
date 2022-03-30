/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

// noinspection JSUnusedGlobalSymbols

declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test'
  }
}

declare module '*.jpg' {
  const src: string
  export default src
}

declare module '*.jpeg' {
  const src: string
  export default src
}

declare module '*.png' {
  const src: string
  export default src
}

declare module '*.svg' {
  import type * as React from 'react'

  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >

  const src: string
  export default src
}

declare module '*.module.css' {
  const classes: Readonly<Record<string, string>>
  export default classes
}

declare module '*.module.scss' {
  const classes: Readonly<Record<string, string>>
  export default classes
}

declare module '*.module.sass' {
  const classes: Readonly<Record<string, string>>
  export default classes
}

declare module 'path-shorten' {
  export interface Options {
    home?: boolean
    homedir?: string
    length?: number
    post?: (text: string) => string
  }

  const pathShorten: (text: string, options?: Options) => string

  export = pathShorten
}
