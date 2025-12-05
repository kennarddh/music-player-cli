import { createWriteStream } from 'fs'
import path from 'path'
import { Stream } from 'stream'
import fs from 'fs/promises'
import Data from './Data.js'
import FileSystem from './FileSystem.js'
import { pipeline } from 'node:stream/promises'

class SoundsData {
	static soundsSavePath = path.join(Data.saveDirPath, './Sounds/')

	static async CreateDirectory() {
		await FileSystem.Process(
			fs.mkdir(this.soundsSavePath, { recursive: true })
		)
	}

	static async Add(
		id: string,
		stream: ReadableStream<Uint8Array<ArrayBufferLike>>
	) {
		await this.CreateDirectory()

		const writeStream = createWriteStream(
			path.join(this.soundsSavePath, `${id}.m4a`)
		)

		await pipeline(stream, writeStream)
	}

	static async Delete(id: string) {
		await this.CreateDirectory()

		await fs.rm(path.join(this.soundsSavePath, `${id}.m4a`))
	}

	static GetSoundFileNameFromId(id: string) {
		return `${id}.m4a`
	}

	static GetSoundPathFromId(id: string) {
		return path.join(this.soundsSavePath, this.GetSoundFileNameFromId(id))
	}
}

export default SoundsData
