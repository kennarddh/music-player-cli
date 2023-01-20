import inquirer from 'inquirer'

import { IVideo } from '../Features/Types'

const ShowVideosCheckbox = async (raw: IVideo[]): Promise<string[]> => {
	const { selected } = await inquirer.prompt({
		type: 'checkbox',
		message: 'Select video',
		name: 'selected',
		choices: raw.map(result => ({
			name: `${result.title}, ${result.author}, ${result.duration}`,
			value: result.id,
		})),
		loop: false,
	})

	return selected
}

export default ShowVideosCheckbox
