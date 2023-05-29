import Audic from 'audic'

import Data from '../../Data/Data.js'
import SoundEvent, { SoundEventStatus } from '../../Data/SoundEvent.js'
import SoundsData from '../../Data/SoundsData.js'

const PlayPlaylist = async (index = 0) => {
	const sounds = await Data.GetCurrentPlaylistSounds()

	const sound = sounds[index]
	const path = SoundsData.GetSoundPathFromId(sound.id)

	const audic = new Audic(path)

	audic.loop = false
	audic.volume = SoundEvent.volume

	await audic.play()

	SoundEvent.status = SoundEventStatus.Playing

	audic.addEventListener('ended', () => {
		audic.destroy()

		SoundEvent.event.removeListener('volumeChange', OnVolumeChange)
		SoundEvent.event.removeListener('statusChange', OnStatusChange)

		if (sounds.length - 1 === index) {
			if (SoundEvent.isLooped) {
				// Restart
				PlayPlaylist(0)
			} else {
				SoundEvent.SetStatus(SoundEventStatus.Stopped)
			}
		} else {
			// Next
			PlayPlaylist(index + 1)
		}
	})

	const OnVolumeChange = (volume: number) => {
		audic.volume = volume
	}

	const OnStatusChange = (status: SoundEventStatus) => {
		if (status === SoundEventStatus.Playing) {
			audic.play()
		} else if (status === SoundEventStatus.Paused) {
			audic.pause()
		} else if (status === SoundEventStatus.Stopped) {
			audic.destroy()

			SoundEvent.event.removeListener('volumeChange', OnVolumeChange)
			SoundEvent.event.removeListener('statusChange', OnStatusChange)
		}
	}

	SoundEvent.event.addListener('volumeChange', OnVolumeChange)
	SoundEvent.event.addListener('statusChange', OnStatusChange)
}

export default PlayPlaylist
