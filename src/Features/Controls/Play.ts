import SoundEvent, { SoundEventStatus } from '../../Data/SoundEvent.js'

const Play = () => {
	if (SoundEvent.status !== SoundEventStatus.Paused) {
		console.log('No paused sound')

		return
	}

	SoundEvent.SetStatus(SoundEventStatus.Playing)
}

export default Play
