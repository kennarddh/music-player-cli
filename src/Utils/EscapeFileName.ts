const EscapeFileName = (raw: string) => raw.replace(/[^\s\d\w]/, '')

export default EscapeFileName
