const Fallback = <T>(object: T, fallback: NonNullable<T>): NonNullable<T> => {
	if (!!object) return object

	return fallback
}

export default Fallback
