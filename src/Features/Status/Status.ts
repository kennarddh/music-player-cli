import inquirer from 'inquirer'
import SoundEvent from '../../Data/SoundEvent.js'

const Status = async () => {
	console.log(`Is muted: ${SoundEvent.isMuted}`)
	console.log(`Is looped: ${SoundEvent.isLooped}`)
	console.log(`Volume: ${SoundEvent.volume * 100}`)
	console.log(`Status: ${SoundEvent.status.toString()}`)

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
