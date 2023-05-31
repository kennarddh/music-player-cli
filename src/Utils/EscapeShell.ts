const EscapeShell = (raw: string) => {
	return `"${raw.replaceAll('"', '\\"')}"`
}

export default EscapeShell
