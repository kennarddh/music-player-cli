import path from 'path'
import fs from 'fs/promises'
import orignalFS from 'fs'
import Data from './Data.js'
import FileSystem from './FileSystem.js'
import sharp from 'sharp'
import IsFileExist from '../Utils/IsFileExist.js'

class ThumbnailsData {
	static thumbnailsSavePath = path.join(Data.saveDirPath, './Thumbnails/')

	static async CreateDirectory() {
		await FileSystem.Process(
			fs.mkdir(this.thumbnailsSavePath, { recursive: true })
		)
	}

	static async Add(id: string, buffer: Buffer) {
		await this.CreateDirectory()

		await sharp(buffer)
			.toFormat('png')
			.toFile(path.join(this.thumbnailsSavePath, `${id}.png`))
	}

	static async Delete(id: string) {
		await this.CreateDirectory()

		const thumbnailPath = path.join(this.thumbnailsSavePath, `${id}.png`)

		if (!(await IsFileExist(thumbnailPath))) return

		await fs.rm(thumbnailPath)
	}

	static GetThumbnailFileNameFromId(id: string) {
		return `${id}.png`
	}

	static GetThumbnailPathFromId(id: string) {
		return path.join(
			this.thumbnailsSavePath,
			this.GetThumbnailFileNameFromId(id)
		)
	}
}

export default ThumbnailsData
