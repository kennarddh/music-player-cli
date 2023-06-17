import ora from 'ora'
import ytdl from 'ytdl-core'
import sharp from 'sharp'

import SoundsData from '../../Data/SoundsData.js'
import YoutubeUrlFromId from '../../Utils/Youtube/YoutubeUrlFromId.js'
import ThumbnailsData from '../../Data/ThumbnailsData.js'

declare const fetch: Function

const AddFromYoutube = (id: string, youtubeId: string, title: string) =>
	new Promise<void>((resolve, reject) => {
		const url = YoutubeUrlFromId(youtubeId)

		const loader = ora(`Downloading ${title} thumbail`)

		loader.start()

		ytdl.getInfo(url)
			.then(info => {
				const thumbnailUrl = info.videoDetails.thumbnails.at(-1)
					?.url as string // Every video has a thumbnail

				return fetch(thumbnailUrl).then((response: any) => {
					if (!response.ok) reject(response.status)

					return response.arrayBuffer() as Buffer
				})
			})
			.then((thumbnailBuffer: Buffer) =>
				ThumbnailsData.Add(id, thumbnailBuffer)
			)
			.then(() => {
				const audio = ytdl(url, { quality: 'highestaudio' })

				loader.text = `Downloading ${title} audio, 0.00%`

				audio.on('progress', (_, downloaded, total) => {
					loader.text = `Downloading ${title} audio, ${(
						(downloaded / total) *
						100
					).toFixed(2)}%`
				})

				SoundsData.Add(id, audio).then(writeStream => {
					writeStream.once('finish', () => {
						loader.succeed(`Downloaded ${title}`)

						resolve()
					})

					writeStream.once('error', error => {
						loader.fail(`Error downloading ${title}`)

						reject(error)
					})
				})
			})
			.catch(error => {
				loader.fail(`Error downloading ${title}`)

				reject(error)
			})
	})

export default AddFromYoutube
