import path from 'path'
import { DirName } from '../Utils/Path.js'
import FileSystem from './FileSystem.js'
import { IData, ISound } from './Types.js'
import fs from 'fs/promises'
import { ValueOrFactory } from '../Utils/Types.js'
import { randomUUID } from 'crypto'
import Fallback from '../Utils/Fallback.js'

class Data {
	static #savePath = path.join(
		DirName(import.meta.url),
		'../../data/saves.json'
	)

	static #data: IData

	static get data() {
		return new Promise<IData>((resolve, reject) => {
			if (!this.#data) {
				fs.access(this.#savePath)
					.then(() => {
						FileSystem.Process(fs.readFile(this.#savePath))
							.then(file => {
								this.#data = JSON.parse(file.toString())

								resolve(this.#data)
							})
							.catch(reject)
					})
					.catch(() => {
						this.#data = {}

						resolve(this.#data)
					})
			} else {
				resolve(this.#data)
			}
		})
	}

	static async Flush() {
		await FileSystem.Process(
			fs.mkdir(path.parse(this.#savePath).dir, { recursive: true })
		)

		await FileSystem.Process(
			fs.writeFile(this.#savePath, JSON.stringify(await this.data))
		)
	}

	static Set(data: IData) {
		this.#data = data
	}

	static async Update(dataOrFactory: ValueOrFactory<IData>) {
		let data: IData

		if (typeof dataOrFactory === 'function') {
			data = dataOrFactory(await this.data)
		} else {
			data = dataOrFactory
		}

		this.Set(data)
	}

	static async UpdateAndSave(dataOrFactory: ValueOrFactory<IData>) {
		await this.Update(dataOrFactory)

		await this.Flush()
	}

	static async NewPlaylist(name: string) {
		const id = randomUUID()

		await this.UpdateAndSave(prev => ({
			...prev,
			playlists: {
				...prev.playlists,
				[id]: { name, sounds: [] },
			},
		}))
	}

	static async NewSound(playlistId: string, sound: ISound) {
		await this.UpdateAndSave(prev => ({
			...prev,
			playlists: {
				...prev.playlists,
				[playlistId]: {
					...Fallback(prev?.playlists?.[playlistId], {}),
					sounds: [
						...Fallback(prev?.playlists?.[playlistId]?.sounds, []),
						sound,
					],
				},
			},
		}))
	}
}

export default Data
