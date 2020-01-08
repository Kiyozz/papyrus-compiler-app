import path from 'path'
import fs from 'fs-extra'
import { Injectable } from '@nestjs/common'

@Injectable()
export default class PathHelper {
  toSlash(value: string): string {
    return value.replace(/\\/g, '/')
  }

  toAntiSlash(value: string): string {
    return value.replace(/\//g, '\\')
  }

  join(...paths: string[]): string {
    return path.join(...paths)
  }

  basename(p: string, ext?: string) {
    return path.basename(p, ext)
  }

  async exists(file: string): Promise<boolean> {
    return fs.pathExists(file)
  }
}
