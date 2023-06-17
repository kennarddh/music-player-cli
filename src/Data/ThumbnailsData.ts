import path from 'path'
import fs from 'fs/promises'
import Data from './Data.js'
import FileSystem from './FileSystem.js'
import sharp from 'sharp'

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

		await fs.rm(path.join(this.thumbnailsSavePath, `${id}.png`))
	}

	static GetSoundFileNameFromId(id: string) {
		return `${id}.png`
	}

	static GetThumbnailPathFromId(id: string) {
		return path.join(
			this.thumbnailsSavePath,
			this.GetSoundFileNameFromId(id)
		)
	}
}

export default ThumbnailsData
