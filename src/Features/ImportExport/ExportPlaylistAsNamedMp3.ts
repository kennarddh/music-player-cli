import inquirer from 'inquirer'
import inquirerFileTreeSelection from 'inquirer-file-tree-selection-prompt'

import fs from 'fs/promises'

import path from 'path'

import FfmpegPath from 'ffmpeg-static'

import Data from '../../Data/Data.js'
import SoundsData from '../../Data/SoundsData.js'
import ExecPromise from '../../Utils/ExecPromise.js'
import EscapeShell from '../../Utils/EscapeShell.js'
import ChunkArray from '../../Utils/ChunkArray.js'
import EscapeFileName from '../../Utils/EscapeFileName.js'
import ora from 'ora'
import { ISound } from '../../Data/Types.js'
import Average from '../../Utils/Average.js'
import Sum from '../../Utils/Sum.js'
import ProperLockFile from 'proper-lockfile'
import GetDirectorySize from '../../Utils/GetDirectorySize.js'

interface IParsedSound extends ISound {
	outputFile: string
	loaderTitleDuplicate: string
	escaped: {
		author: string
		title: string
	}
}

inquirer.registerPrompt('file-tree-selection', inquirerFileTreeSelection)

const ExportPlaylistAsNamedMp3 = async () => {
	if (!(await Data.CheckHaveSelectedPlaylist())) return

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

	const processingTimes: number[] = []

	const soundsPerChunk = 2

	const parsedSounds: IParsedSound[] = []

	for (const sound of sounds) {
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

		parsedSounds.push({
			...sound,
			outputFile,
			loaderTitleDuplicate,
			escaped: {
				author: escapedAuthor,
				title: escapedTitle,
			},
		})
	}

	const estimatedSizeInMegaBytes = parsedSounds.reduce(
		(acc, sound) =>
			acc +
			(sound.duration * parseInt(audioBitRate.slice(0, -1), 10)) /
				8 /
				1024,
		0
	)

	console.log(
		`Estimated output size: ${estimatedSizeInMegaBytes.toFixed(2)}MB`
	)

	const releaseLock = await ProperLockFile.lock(outputDir)

	const soundChunks = ChunkArray(parsedSounds, soundsPerChunk)

	let currentChunk = 0

	for (const chunk of soundChunks) {
		currentChunk += 1

		const loaderMessage = chunk
			.map(sound =>
				sound.loaderTitleDuplicate.substring(0, 20 / soundsPerChunk)
			)
			.join(', ')

		const countMessage = `${currentChunk}/${
			soundChunks.length + 1
		} (${soundsPerChunk})`

		const loader = ora(
			`${countMessage} Exporting ${loaderMessage}, 0s Elapsed`
		)

		loader.start()

		const start = performance.now()

		const loaderInterval = setInterval(() => {
			const now = performance.now()

			loader.text = `${countMessage} Exporting ${loaderMessage}, ${(
				(now - start) /
				1000
			).toFixed(2)}s Elapsed`
		}, 10)

		const promises: Promise<{ stdout: string; stderr: string }>[] = []

		for (const sound of chunk) {
			const inputPath = SoundsData.GetSoundPathFromId(sound.id)

			promises.push(
				ExecPromise(
					`${FfmpegPath} -i ${inputPath} -vn -ar 44100 -ac 2 -map a -b:a ${audioBitRate} -preset ultrafast -metadata artist=${EscapeShell(
						sound.author
					)} -metadata title=${EscapeShell(
						sound.title
					)} ${EscapeShell(sound.outputFile)}.mp3`
				)
			)
		}

		await Promise.all(promises)

		clearInterval(loaderInterval)

		const now = performance.now()

		processingTimes.push(now - start)

		loader.succeed(
			`${countMessage} Exported ${loaderMessage}, ${(
				(now - start) /
				1000
			).toFixed(2)}s Elapsed`
		)
	}

	const actualSizeInMegaBytes =
		(await GetDirectorySize(outputDir)) / 1024 / 1024

	await releaseLock()

	const averageProcessingTime = Average(processingTimes)
	const totalProcessingTime = Sum(processingTimes)

	console.log(
		`Average processing time per batch: ${(
			averageProcessingTime / 1000
		).toFixed(2)}s`
	)
	console.log(
		`Total processing time: ${(totalProcessingTime / 1000).toFixed(2)}s`
	)
	console.log(`Actual output size: ${actualSizeInMegaBytes.toFixed(2)}MB`)
}

export default ExportPlaylistAsNamedMp3
