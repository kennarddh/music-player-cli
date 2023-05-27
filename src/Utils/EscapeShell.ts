const EscapeShell = (raw: string) => {
	return `"${raw.replace('"', '\\"')}"`
}

export default EscapeShell
