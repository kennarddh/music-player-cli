import inquirer from 'inquirer'
import NewPlaylist from './Features/NewPlaylist/NewPlaylist.js'

// Features
import SearchYoutube from './Features/SearchYoutube/SearchYoutube.js'

const { action } = await inquirer.prompt({
	type: 'list',
	message: 'Select action',
	name: 'action',
	choices: [
		{ value: 'searchYoutube', name: 'Search on Youtube' },
		{ value: 'newPlaylist', name: 'Create a new playlist' },
	],
})

switch (action) {
	case 'searchYoutube': {
		await SearchYoutube()

		break
	}
	case 'newPlaylist': {
		await NewPlaylist()

		break
	}
}
