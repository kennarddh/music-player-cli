const EscapeFileName = (raw: string) => raw.replace(/[^\s\d\w]*/g, '')

export default EscapeFileName
