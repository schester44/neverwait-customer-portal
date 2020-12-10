import React from 'react'

import NavFooter from '../../components/NavFooter'

import Location from './components/Location'

const Explore = ({ locations, profile }) => {
	const sortedLocations = React.useMemo(() => {
		if (
			!profile?.locations ||
			(profile.appointments.upcoming.length === 0 && profile.appointments.past.length === 0)
		)
			return locations

		let locationIds = {}

		profile.appointments.upcoming.forEach((appt) => {
			locationIds[appt.location.id] = true
		})

		profile.appointments.past.forEach((appt) => {
			locationIds[appt.location.id] = true
		})

		return locations.sort((a, b) => a.name.localeCompare(b.name))
	}, [profile, locations])

	return (
		<div className="container mx-auto px-4">
			<h1 className="text-center mt-2 text-2xl">Explore</h1>

			<h4 className="my-4 text-gray-700 text-center">Find the perfect barber for you.</h4>

			{sortedLocations.map((location) => {
				if (location.uuid.includes('demo')) return null

				return <Location location={location} key={location.id} />
			})}

			<NavFooter />
		</div>
	)
}

export default Explore
