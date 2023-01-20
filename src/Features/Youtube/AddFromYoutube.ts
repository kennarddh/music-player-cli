import ora from 'ora'
import ytdl from 'ytdl-core'
import SoundsData from '../../Data/SoundsData.js'
import YoutubeUrlFromId from '../../Utils/Youtube/YoutubeUrlFromId.js'

const AddFromYoutube = (id: string, youtubeId: string, title: string) =>
	new Promise<void>((resolve, reject) => {
		const url = YoutubeUrlFromId(youtubeId)

		const audio = ytdl(url, { quality: 'highestaudio' })

		const loader = ora(`Downloading ${title}, 0.00%`)

		loader.start()

		audio.on('progress', (_, downloaded, total) => {
			loader.text = `Downloading ${title}, ${(
				(downloaded / total) *
				100
			).toFixed(2)}%`
		})

		SoundsData.Add(id, audio).then(writeStream => {
			writeStream.once('finish', () => {
				loader.succeed(`Downloaded ${title}`)

				resolve()
			})

			writeStream.once('error', () => {
				loader.fail(`Error downloading ${title}`)

				reject()
			})
		})
	})

export default AddFromYoutube
