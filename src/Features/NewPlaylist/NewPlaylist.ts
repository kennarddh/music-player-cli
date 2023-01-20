import inquirer from 'inquirer'
import Data from '../../Data/Data.js'

const NewPlaylist = async () => {
	const { name } = await inquirer.prompt({
		type: 'input',
		message: 'Playlist Name?',
		name: 'name',
	})

	await Data.NewPlaylist(name)
}

export default NewPlaylist
