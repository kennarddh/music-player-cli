import inquirer from 'inquirer'
import SoundEvent from '../../Data/SoundEvent.js'
import Data from '../../Data/Data.js'

const Status = async () => {
	console.log(`Is muted: ${SoundEvent.isMuted}`)
	console.log(`Is looped: ${SoundEvent.isLooped}`)
	console.log(`Volume: ${SoundEvent.volume * 100}`)
	console.log(`Status: ${SoundEvent.status.toString()}`)

	const playlistName = (await Data.CheckHaveSelectedPlaylist())
		? (await Data.data)?.playlists?.[
				(await Data.data).selectedPlaylist as string
		  ]?.name as string
		: 'None'

	console.log(`Selected Playlist: ${playlistName}`)

	while (true) {
		const { done } = await inquirer.prompt({
			type: 'confirm',
			message: 'Done?',
			name: 'done',
			default: true,
		})

		if (done) break
	}
}

export default Status
