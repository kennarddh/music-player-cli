import { EventEmitter } from 'events'

interface EventEvents {
	volumeChange: (volume: number) => void
	statusChange: (status: SoundEventStatus) => void
}

declare interface Event {
	on<U extends keyof EventEvents>(event: U, listener: EventEvents[U]): this

	once<U extends keyof EventEvents>(event: U, listener: EventEvents[U]): this

	addListener<U extends keyof EventEvents>(
		event: U,
		listener: EventEvents[U]
	): this

	removeListener<U extends keyof EventEvents>(
		event: U,
		listener: EventEvents[U]
	): this

	emit<U extends keyof EventEvents>(
		event: U,
		...args: Parameters<EventEvents[U]>
	): boolean
}

class Event extends EventEmitter {}

export enum SoundEventStatus {
	Playing,
	Paused,
	Stopped,
}

class SoundEvent {
	static event: Event = new Event()
	static status: SoundEventStatus = SoundEventStatus.Stopped
	static volume: number = 1
	static isMuted = false

	static SetVolume(volume: number) {
		this.volume = volume

		if (this.isMuted) return

		this.event.emit('volumeChange', volume)
	}

	static SetStatus(status: SoundEventStatus) {
		this.status = status

		this.event.emit('statusChange', status)
	}

	static ToggleMuted() {
		if (this.isMuted) {
			this.isMuted = false

			this.SetVolume(this.volume)
		} else {
			this.isMuted = true

			this.event.emit('volumeChange', 0)
		}
	}
}

export default SoundEvent
