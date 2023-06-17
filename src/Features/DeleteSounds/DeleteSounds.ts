import inquirer from 'inquirer'
import Data from '../../Data/Data.js'
import SoundsData from '../../Data/SoundsData.js'
import SecondsToDuration from '../../Utils/SecondsToDuration.js'
import ThumbnailsData from '../../Data/ThumbnailsData.js'

const DeleteSounds = async () => {
	const { selected } = await inquirer.prompt({
		type: 'checkbox',
		message: 'Select sounds to delete',
		name: 'selected',
		choices: (
			await Data.GetCurrentPlaylistSounds()
		).map(result => ({
			name: `${result.title}, ${result.author}, ${SecondsToDuration(
				result.duration
			)}`,
			value: result.id,
		})),
		loop: false,
	})

	for (const id of selected) {
		await Data.DeleteSound(id)

		await SoundsData.Delete(id)
		await ThumbnailsData.Delete(id)
	}
}

export default DeleteSounds
