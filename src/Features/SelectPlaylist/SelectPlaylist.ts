import inquirer from 'inquirer'
import Data from '../../Data/Data.js'

const SelectPlaylist = async () => {
	const { id } = await inquirer.prompt({
		type: 'list',
		message: 'Playlist Name?',
		name: 'id',
		choices: Object.entries(await Data.AllPlaylistsIdAndName()).reduce<
			{ value: string; name: string }[]
		>((acc, [id, name]) => {
			acc.push({ value: id, name })
			return acc
		}, []),
	})

	Data.SetSelectedPlaylist(id)
}

export default SelectPlaylist
