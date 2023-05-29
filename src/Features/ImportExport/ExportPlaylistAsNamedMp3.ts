import inquirer from 'inquirer'
import inquirerFileTreeSelection from 'inquirer-file-tree-selection-prompt'

import fs from 'fs/promises'

import path from 'path'

import FfmpegPath from 'ffmpeg-static'
import FfProbe from 'ffprobe-static'

import Data from '../../Data/Data.js'
import SoundsData from '../../Data/SoundsData.js'
import ExecPromise from '../../Utils/ExecPromise.js'
import EscapeShell from '../../Utils/EscapeShell.js'
import EscapeFileName from '../../Utils/EscapeFileName.js'
import ora from 'ora'

inquirer.registerPrompt('file-tree-selection', inquirerFileTreeSelection)

const ExportPlaylistAsNamedMp3 = async () => {
	const { outputDir, shouldGroupedByAuthor, audioBitRate } =
		await inquirer.prompt([
			{
				type: 'confirm',
				name: 'shouldGroupedByAuthor',
				message: 'Should grouped by author?',
			},
			{
				type: 'file-tree-selection',
				name: 'outputDir',
				message: 'Output directory to export',
				onlyShowDir: true,
				enableGoUpperDirectory: true,
			},
			{
				type: 'list',
				name: 'audioBitRate',
				message: 'Select audio bitrate',
				default: '96k',
				choices: [
					{ value: '64k', name: '64 Kilo Bit' },
					{ value: '80k', name: '80 Kilo Bit' },
					{ value: '96k', name: '96 Kilo Bit' },
					{ value: '192k', name: '192 Kilo Bit' },
					{ value: '256k', name: '256 Kilo Bit' },
					{ value: '320k', name: '320 Kilo Bit' },
				],
			},
		])

	const { shouldProceed } = await inquirer.prompt({
		type: 'confirm',
		message: `This will clear all content in ${outputDir}. Are you sure?`,
		name: 'shouldProceed',
		default: false,
	})

	if (!shouldProceed)
		return console.log('Export playlist as named mp3 canceled')

	// Clear outputDir
	await fs.rm(outputDir, { recursive: true })
	await fs.mkdir(outputDir)

	const sounds = await Data.GetCurrentPlaylistSounds()

	const sameLookup: Record<string, number> = {}
	const sameLookupWithGroup: Record<string, Record<string, number>> = {}

	for (const sound of sounds) {
		const inputPath = SoundsData.GetSoundPathFromId(sound.id)

		const escapedAuthor = EscapeFileName(sound.author)
		const escapedTitle = EscapeFileName(sound.title)

		let number: number

		if (!shouldGroupedByAuthor) {
			if (!sameLookup[escapedTitle]) sameLookup[escapedTitle] = 1
			else sameLookup[escapedTitle] += 1

			number = sameLookup[escapedTitle]
		} else {
			if (!sameLookupWithGroup[escapedAuthor]) {
				await fs.mkdir(path.join(outputDir, escapedAuthor))

				sameLookupWithGroup[escapedAuthor] = {}
			}

			if (!sameLookupWithGroup[escapedAuthor][escapedTitle])
				sameLookupWithGroup[escapedAuthor][escapedTitle] = 1
			else sameLookupWithGroup[escapedAuthor][escapedTitle] += 1

			number = sameLookupWithGroup[escapedAuthor][escapedTitle]
		}

		const isDuplicate = number > 1

		const outputFile = path.join(
			outputDir,
			shouldGroupedByAuthor
				? path.join(
						escapedAuthor,
						isDuplicate
							? `${escapedTitle} (${number})`
							: escapedTitle
				  )
				: isDuplicate
				? `${escapedTitle} (${number})`
				: escapedTitle
		)

		const loaderTitle = shouldGroupedByAuthor
			? `${escapedAuthor}/${escapedTitle}`
			: escapedTitle

		const loaderTitleDuplicate = isDuplicate
			? `${loaderTitle} (${number})`
			: loaderTitle

		const loader = ora(`Exporting ${loaderTitleDuplicate}, 0s Elapsed`)

		loader.start()

		const start = performance.now()

		const loaderInterval = setInterval(() => {
			const now = performance.now()

			loader.text = `Exporting ${loaderTitleDuplicate}, ${(
				(now - start) /
				1000
			).toFixed(2)}s Elapsed`
		}, 10)

		await ExecPromise(
			`${FfmpegPath} -i ${inputPath} -vn -ar 44100 -ac 2 -map a -b:a ${audioBitRate} -crf 27 -preset ultrafast ${EscapeShell(
				outputFile
			)}.mp3`
		)

		clearInterval(loaderInterval)

		const now = performance.now()

		loader.succeed(
			`Exported ${loaderTitleDuplicate}, ${((now - start) / 1000).toFixed(
				2
			)}s Elapsed`
		)
	}
}

export default ExportPlaylistAsNamedMp3
