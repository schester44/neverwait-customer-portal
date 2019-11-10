const getAvailableSources = (shift, options = {}) => {
	if (!shift) return null

	let sources = []

	if (shift.acceptingAppointments) {
		if (!options.exclude?.includes('appointments')) {
			sources.push('Appointments')
		}
	}

	if (shift.acceptingCheckins) {
		if (!options.exclude?.includes('checkins')) {
			sources.push('Check-ins')
		}
	}

	if (shift.acceptingWalkins) {
		if (!options.exclude?.includes('walkins')) {
			sources.push('Walk-ins')
		}
	}

	return sources
}

export default getAvailableSources

export const renderSources = sources => {
	if (!sources.length) return null

	if (sources.length === 1) return sources[0]
	if (sources.length === 2) return sources.join(' & ')

	const last = sources.pop()

	return `${sources.join(', ')} & ${last}`
}
