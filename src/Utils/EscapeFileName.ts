const EscapeFileName = (raw: string) =>
	raw
		.replace(/[<>:"\/\\|?]*/g, '')
		.replace(/\s/g, ' ')
		.trim()

export default EscapeFileName
