const EscapeFileName = (raw: string) =>
	raw
		.replace(/[^\s\d\w]*/g, '')
		.replace(/\s/g, ' ')
		.trim()

export default EscapeFileName
