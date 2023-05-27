import { GlobalKeyboardListener } from 'node-global-key-listener'
import SoundEvent, { SoundEventStatus } from '../../Data/SoundEvent.js'

export enum MediaKeys {
	VolumeDecrease = 'VOLUME_DOWN',
	VolumeIncrease = 'VOLUME_UP',
	Mute = 'VOLUME_MUTE',
	Stop = 'MEDIA_STOP',
	Previous = 'MEDIA_PREV_TRACK',
	PlayPause = 'MEDIA_PLAY_PAUSE',
	Next = 'MEDIA_NEXT_TRACK',
}

const KeyboardEvents = () => {
	const globalKeyboardListener = new GlobalKeyboardListener()

	globalKeyboardListener.addListener(event => {
		if (event.state === 'UP') return

		const key = event.rawKey.name

		if (key === MediaKeys.Mute) {
			SoundEvent.ToggleMuted()
		} else if (key === MediaKeys.Stop) {
			if (SoundEvent.status === SoundEventStatus.Stopped) return

			SoundEvent.SetStatus(SoundEventStatus.Stopped)
		} else if (key === MediaKeys.Previous) {
		} else if (key === MediaKeys.PlayPause) {
			if (SoundEvent.status === SoundEventStatus.Stopped) return

			if (SoundEvent.status === SoundEventStatus.Playing) {
				SoundEvent.SetStatus(SoundEventStatus.Paused)
			} else if (SoundEvent.status === SoundEventStatus.Paused) {
				SoundEvent.SetStatus(SoundEventStatus.Playing)
			}
		} else if (key === MediaKeys.Next) {
		}
	})
}

export default KeyboardEvents
