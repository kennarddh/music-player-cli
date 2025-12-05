import Data from '../Data/Data'
import fs from 'fs/promises'
import SoundsData from '../Data/SoundsData'
import ThumbnailsData from '../Data/ThumbnailsData'

const PruneOutdated = async () => {
	const sounds = await Data.GetCurrentPlaylistSounds()

	const ids = sounds.map(sound => sound.id)

	const soundFiles = await fs.readdir(SoundsData.soundsSavePath)

	for (const file of soundFiles) {
		const id = file.replace('.m4a', '')

		if (!ids.includes(id)) {
			await SoundsData.Delete(id)

			console.log(`Pruned outdated sound file: ${file}`)
		}
	}

	const thumbnailFiles = await fs.readdir(ThumbnailsData.thumbnailsSavePath)

	for (const file of thumbnailFiles) {
		const id = file.replace('.png', '')

		if (!ids.includes(id)) {
			await ThumbnailsData.Delete(id)

			console.log(`Pruned outdated thumbnail file: ${file}`)
		}
	}
}

export default PruneOutdated
