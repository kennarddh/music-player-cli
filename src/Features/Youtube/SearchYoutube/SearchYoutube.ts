import { randomUUID } from 'crypto'
import inquirer from 'inquirer'

import ytsr from 'ytsr'
import Data from '../../../Data/Data.js'
import DurationToSeconds from '../../../Utils/DurationToSeconds.js'
import ShowVideosCheckbox from '../../../Utils/ShowVideosCheckbox.js'
import Wait from '../../../Utils/Wait.js'
import AddFromYoutube from '../AddFromYoutube.js'

import { IVideo } from '../../Types'

const SearchYoutube = async () => {
	if (!(await Data.CheckHaveSelectedPlaylist())) return

	const { search } = await inquirer.prompt({
		type: 'input',
		message: 'Search keyword?',
		name: 'search',
	})

	const searchResults = await ytsr(search, { limit: 100 })

	const results = searchResults.items.reduce<IVideo[]>((acc, item) => {
		if (item.type !== 'video') return acc
		if (item.isLive) return acc
		if (item.isUpcoming) return acc

		acc.push({
			title: item.title,
			id: item.id,
			author: item.author?.name ?? 'Unknown',
			duration: item.duration ?? 'Unknown',
			uploadedAt: item.uploadedAt ?? 'Unknown',
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

export default SearchYoutube
