import inquirer from 'inquirer'

import SoundEvent, { SoundEventStatus } from '../../Data/SoundEvent.js'

const ChangeVolume = async () => {
	const { volume } = await inquirer.prompt([
		{
			type: 'number',
			name: 'volume',
			message: 'Volume',
			validate(input) {
				if (input < 0) return 'Volume must be greater than 0'
				if (input > 100) return 'Volume must be smaller than 100'

				return true
			},
		},
	])

	SoundEvent.SetVolume(volume / 100)
}

export default ChangeVolume
