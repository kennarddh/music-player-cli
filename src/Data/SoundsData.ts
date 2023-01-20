import { createWriteStream } from 'fs'
import path from 'path'
import { Stream } from 'stream'
import fs from 'fs/promises'
import Data from './Data.js'
import FileSystem from './FileSystem.js'

class SoundsData {
	static soundsSavePath = path.join(Data.saveDirPath, './Sounds/')

	static async CreateDirectory() {
		await FileSystem.Process(
			fs.mkdir(this.soundsSavePath, { recursive: true })
		)
	}

	static async Download(id: string, stream: Stream) {
		await this.CreateDirectory()

		const writeStream = createWriteStream(
			path.join(this.soundsSavePath, `${id}.mpeg`)
		)

		stream.pipe(writeStream)

		return writeStream
	}
}

export default SoundsData
