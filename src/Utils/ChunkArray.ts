const ChunkArray = <T>(array: T[], n: number) =>
	[...Array(Math.ceil(array.length / n))].map((_, i) =>
		array.slice(i * n, (i + 1) * n)
	)

export default ChunkArray
