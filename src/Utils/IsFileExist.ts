import fs from 'fs/promises'

const IsFileExist = (path: string) =>
	new Promise(resolve => {
		fs.access(path, fs.constants.F_OK)
			.then(() => {
				resolve(true)
			})
			.catch(() => {
				// File doesnt exist, ignore

				resolve(false)
			})
	})

export default IsFileExist
