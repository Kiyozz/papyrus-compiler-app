import path from 'path'
import fs from 'fs-extra'
import fg from 'fast-glob'
import { Injectable } from '@nestjs/common'
import { FileWriteException, FileReadException, FileNotExistsException, FileEnsureException } from '../exceptions/files'
import { LogService } from '../services/log.service'

@Injectable()
export class PathHelper {
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
    return path.join(...paths)
  }

  basename(p: string, ext?: string) {
    return path.basename(p, ext)
  }

  async stat(filename: string): Promise<fs.Stats> {
    return fs.stat(filename)
  }

  async exists(file: string): Promise<boolean> {
    return fs.pathExists(file)
  }

  async ensureDirs(dirs: string[]): Promise<void> {
    this.logService.debug(`Checking presence of directorie${dirs.length > 1 ? 's' : ''}`, ...dirs.map(dir => `"${dir}"`))

    for (const dir of dirs) {
      try {
        await fs.ensureDir(dir)
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
      return fs.readFile(filename)
    } catch (e) {
      throw new FileReadException(filename, e.message)
    }
  }

  async writeFile(filename: string, data: any): Promise<void> {
    this.logService.debug('Writing file', filename, 'with', data)

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

  async getPathsInFolder(fileNames: string[], options: fg.Options): Promise<string[]> {
    return fg(
      fileNames.map(file => this.toSlash(file)),
      options
    )
  }

  get separator() {
    return path.sep
  }
}
