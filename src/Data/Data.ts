import path from 'path'
import { DirName } from '../Utils/Path.js'
import FileSystem from './FileSystem.js'
import { IData } from './Types.js'
import fs from 'fs/promises'
import { ValueOrFactory } from '../Utils/Types.js'

class Data {
	static #savePath = path.join(
		DirName(import.meta.url),
		'../../data/saves.json'
	)

	static #data: IData

	static Flush() {
		FileSystem.Process(
			fs.writeFile(this.#savePath, JSON.stringify(this.#data))
		)
	}

	static Set(data: IData) {
		this.#data = data
	}

	static Update(dataOrFactory: ValueOrFactory<IData>) {
		let data: IData

		if (typeof dataOrFactory === 'function') {
			data = dataOrFactory(this.#data)
		} else {
			data = dataOrFactory
		}

		this.Set(data)
	}

	static UpdateAndSave(dataOrFactory: ValueOrFactory<IData>) {
		this.Update(dataOrFactory)

		this.Flush()
	}
}

export default Data
