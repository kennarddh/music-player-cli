import SoundEvent, { SoundEventStatus } from '../../Data/SoundEvent.js'

const Stop = () => {
	if (SoundEvent.status === SoundEventStatus.Stopped) {
		console.log('Sound already stopped')

		return
	}

	SoundEvent.SetStatus(SoundEventStatus.Stopped)
}

export default Stop
