import inquirer from 'inquirer'
import { randomUUID } from 'crypto'

import AddFromYoutube from '../AddFromYoutube.js'
import Data from '../../../Data/Data.js'
import { IVideo } from '../../Types.js'
import DurationToSeconds from '../../../Utils/DurationToSeconds.js'
import ShowVideosCheckbox from '../../../Utils/ShowVideosCheckbox.js'
import Wait from '../../../Utils/Wait.js'
import ora from 'ora'
import ThumbnailsData from '../../../Data/ThumbnailsData.js'
import SoundsData from '../../../Data/SoundsData.js'

interface IVideoExtended extends IVideo {
	thumbailURL: string | null
}

export interface YouTubePlaylistResponse {
	kind: string
	etag: string
	items: YouTubePlaylistItem[]
	nextPageToken?: string
	prevPageToken?: string
	pageInfo: PageInfo
}

export interface PageInfo {
	totalResults: number
	resultsPerPage: number
}

export interface YouTubePlaylistItem {
	kind: string
	etag: string
	id: string
	snippet: PlaylistItemSnippet
}

export interface PlaylistItemSnippet {
	publishedAt: string
	channelId: string
	title: string
	description: string
	thumbnails: Thumbnails
	channelTitle: string
	playlistId: string
	position: number
	resourceId: ResourceId
	videoOwnerChannelTitle: string
	videoOwnerChannelId: string
}

export interface Thumbnails {
	default: ThumbnailDetails
	medium: ThumbnailDetails
	high: ThumbnailDetails
	// standard and maxres are technically optional in the YouTube API
	// depending on video resolution, though present in your JSON.
	standard?: ThumbnailDetails
	maxres?: ThumbnailDetails
}

export interface ThumbnailDetails {
	url: string
	width: number
	height: number
}

export interface ResourceId {
	kind: string
	videoId: string
}

const ImportFromYoutubePlaylist = async () => {
	if (!(await Data.CheckHaveSelectedPlaylist())) return

	const { playlistId } = await inquirer.prompt({
		type: 'input',
		message: 'Playlist id?',
		name: 'playlistId',
	})

	const loader = ora(`Fetching videos from playlist`)

	loader.start()

	const playlistItems = []

	let pageToken: string | null = ''

	while (pageToken !== null) {
		try {
			const fetchRes = await fetch(
				`https://www.googleapis.com/youtube/v3/playlistItems?key=${process.env.YOUTUBE_API_KEY}&playlistId=${playlistId}&part=snippet&maxResults=50&pageToken=${pageToken}`
			)

			if (!fetchRes.ok) {
				console.error(`HTTP error! status: ${fetchRes.status}`)

				return
			}

			const data = (await fetchRes.json()) as YouTubePlaylistResponse

			playlistItems.push(...data.items)

			pageToken = data.nextPageToken ?? null
		} catch (error) {
			console.log(error)
			loader.fail(`Error fetching playlist`)

			return
		}
	}

	loader.succeed(`Fetched ${playlistItems.length} videos from playlist`)

	const results = playlistItems.reduce<IVideoExtended[]>((acc, item) => {
		acc.push({
			title: item.snippet.title,
			id: item.snippet.resourceId.videoId,
			author: item.snippet.videoOwnerChannelTitle ?? 'Unknown',
			duration: 'Unknown',
			uploadedAt: '',
			thumbailURL:
				(item.snippet.thumbnails.maxres?.url ||
					item.snippet.thumbnails.high?.url ||
					item.snippet.thumbnails.medium?.url ||
					item.snippet.thumbnails.default?.url) ??
				null,
		})

		return acc
	}, [])

	const selected = await ShowVideosCheckbox(results)
	const sounds = await Data.GetCurrentPlaylistSounds()

	let i = 1

	let totalSkipped = 0
	let totalThumbnailError = 0
	let totalAudioError = 0
	let totalSuccess = 0

	for (const videoId of selected) {
		const id = randomUUID()

		const videoData = results.find(
			({ id: iterId }) => iterId === videoId
		) as IVideoExtended

		if (sounds.find(sound => sound.title === videoData.title)) {
			console.log(
				`${i}/${selected.length}: Skipped ${videoData.title} from playlist import as it is already in the playlist`
			)

			totalSkipped++

			i++

			continue
		}

		if (videoData.thumbailURL !== null) {
			try {
				const thumbailResponse = await fetch(videoData.thumbailURL)

				if (thumbailResponse.ok) {
					const thumbnailArrayBuffer =
						await thumbailResponse.arrayBuffer()

					const thumbnailBuffer = Buffer.from(thumbnailArrayBuffer)

					ThumbnailsData.Add(id, thumbnailBuffer)
				} else {
					console.error(
						`${i}/${selected.length}: Failed to fetch thumbail ${videoData.title} ${videoData.thumbailURL}, response not ok`
					)

					console.error(thumbailResponse)

					totalThumbnailError++
				}
			} catch (error) {
				console.error(
					`${i}/${selected.length}: Failed to fetch thumbail ${videoData.title} ${videoData.thumbailURL}`
				)

				console.error(error)

				totalThumbnailError++
			}
		}

		try {
			await AddFromYoutube(id, videoId, videoData.title as string)

			await Data.NewSound({
				author: videoData.author,
				duration: DurationToSeconds(videoData.duration),
				id,
				title: videoData.title,
				addedAt: new Date().getTime(),
			})

			console.log(
				`${i}/${selected.length}: Imported ${videoData.title} from playlist`
			)

			totalSuccess++
		} catch (error) {
			console.error(
				`${i}/${selected.length}: Failed to import "${videoData.id}" ${videoData.title} from playlist`
			)

			console.error(error)

			totalAudioError++
		}

		if (i % 40 === 0) {
			console.log(
				'Waiting for 15 minutes extra to avoid YouTube rate limiting'
			)

			await Wait(15 * 60 * 1000)
		} else {
			console.log('Waiting for 25 seconds to avoid YouTube rate limiting')

			await Wait(25000)
		}

		i++
	}

	console.log('Playlist import complete!')
	console.log(`Total imported: ${totalSuccess}`)
	console.log(`Total skipped: ${totalSkipped}`)
	console.log(`Total thumbnail errors: ${totalThumbnailError}`)
	console.log(`Total audio errors: ${totalAudioError}`)
}

export default ImportFromYoutubePlaylist
