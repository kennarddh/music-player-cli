import inquirer from 'inquirer'

// Features
import SearchYoutube from './Features/Youtube/SearchYoutube/SearchYoutube.js'
import NewPlaylist from './Features/NewPlaylist/NewPlaylist.js'
import SelectPlaylist from './Features/SelectPlaylist/SelectPlaylist.js'
import ViewPlaylist from './Features/ViewPlaylist/ViewPlaylist.js'
import DeleteSounds from './Features/DeleteSounds/DeleteSounds.js'

while (true) {
	const { action } = await inquirer.prompt({
		type: 'list',
		message: 'Select action',
		name: 'action',
		choices: [
			{ value: 'searchYoutube', name: 'Search on Youtube' },
			{ value: 'newPlaylist', name: 'Create New Playlist' },
			{ value: 'selectPlaylist', name: 'Select a Playlist' },
			{ value: 'viewPlaylist', name: 'View a Playlist' },
			{ value: 'deleteSounds', name: 'Delete Sounds From a Playlist' },
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
		case 'viewPlaylist': {
			await ViewPlaylist()

			break
		}
		case 'deleteSounds': {
			await DeleteSounds()

			break
		}
	}
}
