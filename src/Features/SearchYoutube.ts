import inquirer from 'inquirer'

import ytsr from 'ytsr'

import { ISearchResult } from './Types'

const SearchYoutube = async () => {
	const { search } = await inquirer.prompt({
		type: 'input',
		message: 'Search keyword?',
		name: 'search',
	})

	const searchResults = await ytsr(search, { pages: 1, limit: 100 })

	const results = searchResults.items.reduce<ISearchResult[]>((acc, item) => {
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

	const { selected } = await inquirer.prompt({
		type: 'checkbox',
		message: 'Select video',
		name: 'selected',
		prefix: ' ',
		choices: results.map(result => ({
			name: `${result.title}, ${result.author}, ${result.duration}`,
			value: result.id,
		})),
		loop: false,
	})

	console.log(selected)
}

export default SearchYoutube
