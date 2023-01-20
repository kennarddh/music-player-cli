import { RecursivePartial } from '../Utils/Types'

export interface ISound {
	id: string
	title: string
	uploadedAt: string
	author: string
	duration: number
}

export interface IPlaylist {
	sounds: ISound[]
	name: string
}

export type IPlaylists = Record<string, IPlaylist>

export interface IRequiredData {
	playlists: IPlaylists
	selectedPlaylist: string
}

export type IData = RecursivePartial<IRequiredData>
