const Clamp = (min: number, number: number, max: number): number =>
	Math.min(Math.max(number, min), max)

export default Clamp
