import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { Response } from 'express'
import { readdirSync } from 'fs'
import { join } from 'path'
import { of } from 'rxjs'

@Injectable()
export class FileuploadService {
  private readonly logger = new Logger(FileuploadService.name)

  private formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
  }

  uploadImage(file: Express.Multer.File) {
    try {
      this.logger.log(`File uploaded successfully: ${file.filename} (${this.formatBytes(file.size)})`)
      return {
        'success': true,
        'data': file
      }

    } catch (err) {
      this.logger.error('An error occurred while uploading an image')
      return {
        'success': false,
        'data': err
      }
    }
  }

  getImage(res: Response, filename: string) {
    const files = readdirSync('./uploads')
    // console.log(files)
    // console.log(files.includes(filename))

    if (files.includes(filename))
      return of(res.sendFile(join(process.cwd(), `./uploads/${filename}`)))
    throw new NotFoundException('Image not found.')
  }

}
