import inquirer from 'inquirer'

import SoundEvent, { SoundEventStatus } from './Data/SoundEvent.js'

// Features
import SearchYoutube from './Features/Youtube/SearchYoutube/SearchYoutube.js'
import NewPlaylist from './Features/NewPlaylist/NewPlaylist.js'
import SelectPlaylist from './Features/SelectPlaylist/SelectPlaylist.js'
import ViewPlaylist from './Features/ViewPlaylist/ViewPlaylist.js'
import DeleteSounds from './Features/DeleteSounds/DeleteSounds.js'
import ImportFromYoutubePlaylist from './Features/Youtube/ImportFromYoutubePlaylist/ImportFromYoutubePlaylist.js'
import PlayPlaylist from './Features/PlayPlaylist/PlayPlaylist.js'
import ChangeVolume from './Features/Controls/ChangeVolume.js'
import Pause from './Features/Controls/Pause.js'
import Play from './Features/Controls/Play.js'
import Stop from './Features/Controls/Stop.js'
import KeyboardEvents from './Features/Controls/KeyboardEvents.js'
import ToggleMuted from './Features/Controls/ToggleMuted.js'
import ToggleLooped from './Features/Controls/ToggleLooped.js'
import Status from './Features/Status/Status.js'

KeyboardEvents()

while (true) {
	const { action } = await inquirer.prompt({
		type: 'list',
		message: 'Select action',
		name: 'action',
		choices: [
			{ value: 'searchYoutube', name: 'Search on Youtube' },
			{
				value: 'importFromYoutubePlaylist',
				name: 'Import From Youtube Playlist',
			},
			new inquirer.Separator(),
			{ value: 'newPlaylist', name: 'Create New Playlist' },
			{ value: 'selectPlaylist', name: 'Select a Playlist' },
			{ value: 'viewPlaylist', name: 'View a Playlist' },
			{ value: 'deleteSounds', name: 'Delete Sounds From a Playlist' },
			{ value: 'playPlaylist', name: 'Play a Playlist' },
			new inquirer.Separator(),
			{ value: 'changeVolume', name: 'Change Volume' },
			{ value: 'pause', name: 'Pause' },
			{ value: 'play', name: 'Play' },
			{ value: 'stop', name: 'Stop' },
			{ value: 'toggleMuted', name: 'Toggle Is Muted' },
			{ value: 'toggleLooped', name: 'Toggle Is Looped' },
			{ value: 'status', name: 'Show Status' },
		],
		loop: false,
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
		case 'importFromYoutubePlaylist': {
			await ImportFromYoutubePlaylist()

			break
		}
		case 'playPlaylist': {
			if (SoundEvent.status !== SoundEventStatus.Stopped) {
				console.log('Sound is not stopped')

				break
			}

			await PlayPlaylist()

			break
		}
		case 'changeVolume': {
			await ChangeVolume()

			break
		}
		case 'pause': {
			Pause()

			break
		}
		case 'play': {
			Play()

			break
		}
		case 'stop': {
			Stop()

			break
		}
		case 'toggleMuted': {
			ToggleMuted()

			break
		}
		case 'toggleLooped': {
			ToggleLooped()

			break
		}
		case 'status': {
			await Status()

			break
		}
	}
}
