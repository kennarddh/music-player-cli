import SoundEvent, { SoundEventStatus } from '../../Data/SoundEvent.js'

const Pause = () => {
	if (SoundEvent.status !== SoundEventStatus.Playing) {
		console.log('No playing sound')

		return
	}

	SoundEvent.SetStatus(SoundEventStatus.Paused)
}

export default Pause
