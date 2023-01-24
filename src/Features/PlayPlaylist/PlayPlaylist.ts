import Audic from 'audic'

import Data from '../../Data/Data.js'
import SoundsData from '../../Data/SoundsData.js'

const PlayPlaylist = async () => {
	const sounds = await Data.GetCurrentPlaylistSounds()

	for (const sound of sounds) {
		const path = SoundsData.GetSoundPathFromId(sound.id)

		console.log(sound)

		const audic = new Audic(path)

		audic.loop = false

		await audic.play()

		await new Promise<void>(resolve => {
			audic.addEventListener('timeupdate', () => {
				if (audic.currentTime === audic.duration - 1) {
					console.log('end')
					resolve()
				}
			})
		})

		console.log('end destroy')

		audic.destroy()
	}
}

export default PlayPlaylist
