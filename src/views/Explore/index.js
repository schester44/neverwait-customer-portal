import React from 'react'
import { Redirect } from 'react-router-dom'

import NavFooter from '../../components/NavFooter'

import Location from './components/Location'

const Explore = ({ locations, profile }) => {
	const filteredLocations = React.useMemo(() => {
		if (profile.appointments.upcoming.length === 0 && profile.appointments.past.length === 0)
			return locations

		let locationIds = {}

		profile.appointments.upcoming.forEach(appt => {
			locationIds[appt.location.id] = true
		})

		profile.appointments.past.forEach(appt => {
			locationIds[appt.location.id] = true
		})

		return locations.filter(location => !!locationIds[location.id])
	}, [locations, profile])

	// The only time we should redirect to the last appointment's location is if there is only 1 filtered location (and if the total locations on the app are > 1)
	const shouldRedirectToLastAppointment =
		filteredLocations.length === 1 && filteredLocations.length <= locations.length

	if (shouldRedirectToLastAppointment) {
		return <Redirect to="/" />
	}

	return (
		<div className="container mx-auto px-4">
			<h1 className="text-center mt-2 text-2xl">Explore</h1>

			<h4 className="my-4 text-gray-700 text-center">
				The perfect barber or stylist is just ahead.
			</h4>

			{filteredLocations.map(location => {
				if (location.uuid.includes('demo')) return null

				return <Location location={location} key={location.id} />
			})}

			<NavFooter />
		</div>
	)
}

export default Explore
