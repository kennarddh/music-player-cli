const DurationToSeconds = (duration: string): number => {
	const splited = duration.split(':')

	if (splited.length === 1) {
		splited.unshift('0', '0')
	} else if (splited.length === 2) {
		splited.unshift('0')
	}

	const numberParsed = splited.map(int => parseInt(int, 10))

	const [hours, minutes, seconds] = numberParsed

	const result = (hours * 60 + minutes) * 60 + seconds

	return result
}

export default DurationToSeconds
