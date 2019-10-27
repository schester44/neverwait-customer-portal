import React from 'react'
import styled from 'styled-components'
import { generatePath, Redirect } from 'react-router-dom'

import NavFooter from '../HomeScreen/NavFooter'
import { Header } from '../HomeScreen/Header'

import { LOCATION_WAITLIST } from '../../routes'
import Location from './components/Location'

const Container = styled('div')`
	width: 100%;
	min-height: 100%;
	display: flex;
	flex-direction: column;

	padding-top: 45px;

	.content {
		padding: 20px;
	}

	.sell-it {
		padding-top: 25px;
		padding-bottom: 10px;
		width: 100%;
		text-align: center;

		h4 {
			padding-top: 4px;
			opacity: 0.5;
		}
	}
`

const Explore = ({ locations, profile }) => {
	const filteredLocations = React.useMemo(() => {
		if (profile.appointments.upcoming.length === 0 && profile.appointments.past.length === 0) return locations

		let locationIds = {}

		profile.appointments.upcoming.forEach(appt => {
			locationIds[appt.location.id] = true
		})

		profile.appointments.past.forEach(appt => {
			locationIds[appt.location.id] = true
		})

		return locations.filter(location => !!locationIds[location.id])
	}, [locations, profile])

	const shouldRedirectToLastAppointment = filteredLocations.length === 1 && filteredLocations.length <= locations.length

	if (shouldRedirectToLastAppointment) {
		return <Redirect to={generatePath(LOCATION_WAITLIST, { uuid: filteredLocations[0].uuid })} />
	}

	return (
		<Container>
			<Header title="Explore" />

			<div className="sell-it">
				<h2>Select a location to check-in</h2>
				<h4>The perfect barber or stylist is just ahead.</h4>
			</div>

			<div className="content">
				{filteredLocations.map(location => {
					if (location.uuid.includes('demo')) return null

					return <Location location={location} key={location.id} />
				})}
			</div>

			<NavFooter />
		</Container>
	)
}

export default Explore
