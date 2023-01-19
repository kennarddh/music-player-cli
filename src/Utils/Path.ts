import { fileURLToPath } from 'url'

export const DirName = (metaUrl: string) => {
	return fileURLToPath(new URL('.', metaUrl))
}
