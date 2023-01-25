import Audic from 'audic'

import Data from '../../Data/Data.js'
import SoundEvent, { SoundEventStatus } from '../../Data/SoundEvent.js'
import SoundsData from '../../Data/SoundsData.js'

const PlayPlaylist = async () => {
	const sounds = await Data.GetCurrentPlaylistSounds()

	let stopped: boolean = false

	for (const sound of sounds) {
		if (stopped) return

		const path = SoundsData.GetSoundPathFromId(sound.id)

		const audic = new Audic(path)

		audic.loop = false

		await audic.play()

		audic.addEventListener('timeupdate', () => {
			if (audic.currentTime === audic.duration - 1) {
				audic.destroy()
			}
		})

		SoundEvent.event.addListener('volumeChange', volume => {
			audic.volume = volume
		})

		SoundEvent.event.addListener('statusChange', status => {
			if (status === SoundEventStatus.Playing) {
				audic.play()
			} else if (status === SoundEventStatus.Paused) {
				audic.pause()
			} else if (status === SoundEventStatus.Stopped) {
				audic.destroy()

				stopped = true
			}
		})
	}
}

export default PlayPlaylist
