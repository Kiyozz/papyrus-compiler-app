import path from 'path'
import fs from 'fs-extra'
import { Injectable } from '@nestjs/common'
import { FileWriteException, FileReadException, FileNotExistsException, FileEnsureException } from '../exceptions/files'

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

  async ensureDirs(dirs: string[]): Promise<void> {
    for (const dir of dirs) {
      try {
        await fs.ensureDir(dir)
      } catch (e) {
        throw new FileEnsureException(dir)
      }
    }
  }

  async readFile(filename: string): Promise<Buffer> {
    const fileExists = await this.exists(filename)

    if (!fileExists) {
      throw new FileNotExistsException(filename)
    }

    try {
      return fs.readFile(filename)
    } catch (e) {
      throw new FileReadException(filename, e.message)
    }
  }

  async writeFile(filename: string, data: any): Promise<void> {
    const fileExists = this.exists(filename)

    if (!fileExists) {
      throw new FileNotExistsException(filename)
    }

    try {
      return fs.writeFile(filename, data)
    } catch (e) {
      throw new FileWriteException(filename, e.message)
    }
  }
}
