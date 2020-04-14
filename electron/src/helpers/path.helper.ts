import path from 'path'
import fs from 'fs-extra'
import fg from 'fast-glob'
import { Injectable } from '@nestjs/common'
import {
  FileWriteException,
  FileReadException,
  FileNotExistsException,
  FileEnsureException,
  FileAccessException
} from '../exceptions/files'
import { LogService } from '../services/log.service'

@Injectable()
export class PathHelper {
  private path: typeof path = path
  private fs: typeof fs = fs
  private fg: typeof fg = fg

  constructor(
    private readonly logService: LogService
  ) {}

  toSlash(value: string): string {
    return value.replace(/\\/g, '/')
  }

  toAntiSlash(value: string): string {
    return value.replace(/\//g, '\\')
  }

  join(...paths: string[]): string {
    return this.path.join(...paths)
  }

  basename(p: string, ext?: string) {
    return this.path.basename(p, ext)
  }

  async stat(filename: string): Promise<fs.Stats> {
    try {
      return this.fs.stat(filename)
    } catch (e) {
      throw new FileAccessException(filename)
    }
  }

  async exists(fileOrFolder: string): Promise<boolean> {
    return this.fs.pathExists(fileOrFolder)
  }

  async ensureDirs(dirs: string[]): Promise<void> {
    this.logService.debug(`Checking presence of directorie${dirs.length > 1 ? 's' : ''}`, ...dirs.map(dir => `"${dir}"`))

    for (const dir of dirs) {
      try {
        await this.fs.ensureDir(dir)
      } catch (e) {
        throw new FileEnsureException(dir)
      }
    }
  }

  async readFile(filename: string): Promise<Buffer> {
    this.logService.debug('Reading file ', filename)

    const fileExists = await this.exists(filename)

    if (!fileExists) {
      throw new FileNotExistsException(filename)
    }

    try {
      return this.fs.readFile(filename)
    } catch (e) {
      throw new FileReadException(filename, e.message)
    }
  }

  async writeFile(filename: string, data: any): Promise<void> {
    this.logService.debug('Writing file', filename, 'with', data)

    const fileExists = await this.exists(filename)

    if (!fileExists) {
      throw new FileNotExistsException(filename)
    }

    try {
      return this.fs.writeFile(filename, data)
    } catch (e) {
      throw new FileWriteException(filename, e.message)
    }
  }

  async getPathsInFolder(fileNames: string[], options: fg.Options): Promise<string[]> {
    return this.fg(
      fileNames.map(file => this.toSlash(file)),
      options
    )
  }

  get separator() {
    return this.path.sep
  }
}
