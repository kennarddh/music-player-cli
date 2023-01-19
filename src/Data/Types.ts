export interface IData {
	playlists: Record<
		string,
		{ sounds: { id: string; name: string; duration: number }[] }
	>
}
