import inquirer from 'inquirer'
import ytpl from 'ytpl'
import { randomUUID } from 'crypto'

import AddFromYoutube from '../AddFromYoutube.js'
import Data from '../../../Data/Data.js'
import { IVideo } from '../../Types.js'
import DurationToSeconds from '../../../Utils/DurationToSeconds.js'
import ShowVideosCheckbox from '../../../Utils/ShowVideosCheckbox.js'
import Wait from '../../../Utils/Wait.js'

const ImportFromYoutubePlaylist = async () => {
	if (!(await Data.CheckHaveSelectedPlaylist())) return

	const { playlistId } = await inquirer.prompt({
		type: 'input',
		message: 'Playlist id?',
		name: 'playlistId',
	})

	if (!ytpl.validateID(playlistId)) {
		console.log('Invalid playlist id')

		return
	}

	const getResults = await ytpl(playlistId, { limit: Infinity })

	const results = getResults.items.reduce<IVideo[]>((acc, item) => {
		if (item.isLive) return acc

		acc.push({
			title: item.title,
			id: item.id,
			author: item.author?.name ?? 'Unknown',
			duration: item.duration ?? 'Unknown',
			uploadedAt: '',
		})

		return acc
	}, [])

	const selected = await ShowVideosCheckbox(results)

	for (const videoId of selected) {
		const id = randomUUID()

		const videoData = results.find(
			({ id: iterId }) => iterId === videoId
		) as IVideo

		await AddFromYoutube(id, videoId, videoData.title as string)

		await Data.NewSound({
			author: videoData.author,
			duration: DurationToSeconds(videoData.duration),
			id,
			title: videoData.title,
			addedAt: new Date().getTime(),
		})

		await Wait(2000)
	}
}

export default ImportFromYoutubePlaylist
