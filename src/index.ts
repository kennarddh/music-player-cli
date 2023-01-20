import inquirer from 'inquirer'

// Features
import SearchYoutube from './Features/Youtube/SearchYoutube/SearchYoutube.js'
import NewPlaylist from './Features/NewPlaylist/NewPlaylist.js'
import SelectPlaylist from './Features/SelectPlaylist/SelectPlaylist.js'

while (true) {
	const { action } = await inquirer.prompt({
		type: 'list',
		message: 'Select action',
		name: 'action',
		choices: [
			{ value: 'searchYoutube', name: 'Search on Youtube' },
			{ value: 'newPlaylist', name: 'Create New Playlist' },
			{ value: 'selectPlaylist', name: 'Select a Playlist' },
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
		case 'selectPlaylist': {
			await SelectPlaylist()

			break
		}
	}
}
