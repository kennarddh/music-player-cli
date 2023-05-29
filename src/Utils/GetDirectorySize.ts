import fs from 'fs/promises'
import path from 'path'

/**
 * Output in bytes
 */
const GetDirectorySize = async (dirPath: string) => {
	let size = 0

	const files = await fs.readdir(dirPath)

	for (let i = 0; i < files.length; i++) {
		const filePath = path.join(dirPath, files[i])
		const stats = await fs.stat(filePath)

		if (stats.isFile()) {
			size += stats.size
		} else if (stats.isDirectory()) {
			size += await GetDirectorySize(filePath)
		}
	}

	return size
}

export default GetDirectorySize
