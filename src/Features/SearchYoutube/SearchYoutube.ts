import { randomUUID } from 'crypto'
import inquirer from 'inquirer'

import ytsr from 'ytsr'
import ShowVideosCheckbox from '../../Utils/ShowVideosCheckbox.js'
import Wait from '../../Utils/Wait.js'
import AddFromYoutube from '../AddFromYoutube.js'

import { IVideo } from '../Types'

const SearchYoutube = async () => {
	const { search } = await inquirer.prompt({
		type: 'input',
		message: 'Search keyword?',
		name: 'search',
	})

	// Disable ytsr error log
	const prevConsoleError = console.error
	console.error = () => {}
	const searchResults = (await ytsr(search, { limit: 100 }).catch(() => {
		// Error parsing shorts
		// https://github.com/TimeForANinja/node-ytsr/issues/174
		// https://github.com/TimeForANinja/node-ytsr/pull/178
	})) as ytsr.Result
	console.error = () => prevConsoleError

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

		await AddFromYoutube(
			id,
			videoId,
			results.find(({ id: iterId }) => iterId === videoId)
				?.title as string
		)

		await Wait(2000)
	}
}

export default SearchYoutube
