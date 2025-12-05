import Data from '../Data/Data'
import fs from 'fs/promises'
import SoundsData from '../Data/SoundsData'
import ThumbnailsData from '../Data/ThumbnailsData'

const VerifyData = async () => {
	const sounds = await Data.GetCurrentPlaylistSounds()

	const ids = sounds.map(sound => sound.id)

	for (const id of ids) {
		const soundPath = SoundsData.GetSoundPathFromId(id)
		const thumbailPath = ThumbnailsData.GetThumbnailPathFromId(id)

		try {
			await fs.access(soundPath, fs.constants.F_OK)
		} catch {
			console.warn(
				`Sound file for ID ${id} does not exist at ${soundPath}.`
			)
		}

		try {
			await fs.access(thumbailPath, fs.constants.F_OK)
		} catch {
			console.warn(
				`Thumbnail file for ID ${id} does not exist at ${thumbailPath}.`
			)
		}
	}
}

export default VerifyData
