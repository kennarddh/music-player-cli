import ora from 'ora'
import { ClientType, Innertube } from 'youtubei.js'

import SoundsData from '../../Data/SoundsData.js'

const innertube = await Innertube.create({
	client_type: ClientType.ANDROID,
	generate_session_locally: true,
})

const AddFromYoutube = async (id: string, youtubeId: string, title: string) => {
	return new Promise<void>(async (resolve, reject) => {
		const loader = ora(
			`Downloading ${title} audio: ${new Date().toISOString()}`
		)

		loader.start()

		innertube
			.download(youtubeId, {
				type: 'audio',
				quality: 'best',
				codec: 'mp4a',
			})
			.then(result => SoundsData.Add(id, result))
			.then(() => {
				loader.succeed(
					`Finished downloading ${title} audio: ${new Date().toISOString()}`
				)

				resolve()
			})
			.catch(error => {
				loader.fail(
					`Error downloading ${title}: ${new Date().toISOString()}`
				)

				reject(error)
			})
	})
}

export default AddFromYoutube
