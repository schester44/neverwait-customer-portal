export default mins => {
	const hours = Math.floor(mins / 60)
	const minutes = Math.floor(60 * ((mins / 60) % 1))

	return { hours, minutes }
}
