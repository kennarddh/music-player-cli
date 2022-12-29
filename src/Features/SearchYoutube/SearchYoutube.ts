import inquirer from 'inquirer'

import ytsr from 'ytsr'
import ShowVideosCheckbox from '../../Utils/ShowVideosCheckbox.js'

import { IVideo } from '../Types'

const SearchYoutube = async () => {
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

	console.log(selected)
}

export default SearchYoutube
