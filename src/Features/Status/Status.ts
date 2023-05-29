import inquirer from 'inquirer'
import PressToContinuePrompt from 'inquirer-press-to-continue'

import SoundEvent from '../../Data/SoundEvent.js'
import Data from '../../Data/Data.js'

inquirer.registerPrompt('press-to-continue', PressToContinuePrompt)

const Status = async () => {
	console.log(`Is muted: ${SoundEvent.isMuted}`)
	console.log(`Is looped: ${SoundEvent.isLooped}`)
	console.log(`Volume: ${SoundEvent.volume * 100}`)
	console.log(`Status: ${SoundEvent.status.toString()}`)

	const playlistName = (await Data.CheckHaveSelectedPlaylist())
		? ((await Data.data)?.playlists?.[
				(await Data.data).selectedPlaylist as string
		  ]?.name as string)
		: 'None'

	console.log(`Selected Playlist: ${playlistName}`)

	await inquirer.prompt({
		name: 'key',
		type: 'press-to-continue',
		enter: true,
		pressToContinueMessage: 'Press enter to exit',
	})
}

export default Status
