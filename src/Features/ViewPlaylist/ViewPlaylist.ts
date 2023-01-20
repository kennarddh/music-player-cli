import Data from '../../Data/Data.js'
import SecondsToDuration from '../../Utils/SecondsToDuration.js'

const ViewPlaylist = async () => {
	const sounds = await Data.GetCurrentPlaylistSounds()

	for (const sound of sounds) {
		console.log(
			`- ${sound.title}, ${sound.author}, ${SecondsToDuration(
				sound.duration
			)}`
		)
	}
}

export default ViewPlaylist
