export interface ISound {
	id: string
	title: string
	uploadedAt: string
	author: string
	duration: number
}

export type IPlaylists = Record<string, { sounds: ISound[] }>

export interface IData {
	playlists: IPlaylists
}
