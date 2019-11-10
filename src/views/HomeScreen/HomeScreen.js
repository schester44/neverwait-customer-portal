import React from 'react'
import styled from 'styled-components'
import NavFooter from './NavFooter'
import { useHistory, generatePath } from 'react-router-dom'

import splashImage from '../../themes/assets/undraw_barber_3uel.svg'
import Button from '../../components/Button'

import { LOCATION_CHECKIN, LOCATION_SEARCH, LOCATION_APPOINTMENT } from '../../routes'

const Container = styled('div')`
	padding: 20px;
	padding-bottom: 100px;
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	height: 100vh;

	.app-title {
		text-align: center;
	}

	.splash-image {
		max-width: 100%;
	}
`

const HomeScreen = ({ profile }) => {
	const history = useHistory()

	const filteredLocations = React.useMemo(() => {
		if (profile.appointments.upcoming.length === 0 && profile.appointments.past.length === 0) return profile.locations

		let locationIds = {}

		profile.appointments.upcoming.forEach(appt => {
			locationIds[appt.location.id] = true
		})

		profile.appointments.past.forEach(appt => {
			locationIds[appt.location.id] = true
		})

		return profile.locations.filter(location => !!locationIds[location.id])
	}, [profile])

	const shouldRedirectToLastAppointment =
		filteredLocations.length === 1 && filteredLocations.length <= profile.locations.length

	const handleCheckin = () => {
		if (shouldRedirectToLastAppointment) {
			history.push(generatePath(LOCATION_CHECKIN, { uuid: filteredLocations[0].uuid }))
		} else {
			history.push(LOCATION_SEARCH, { action: 'checkin' })
		}
	}

	const handleCreateAppointment = () => {
		if (shouldRedirectToLastAppointment) {
			history.push(generatePath(LOCATION_APPOINTMENT, { uuid: filteredLocations[0].uuid }))
		} else {
			history.push(LOCATION_SEARCH, { action: 'checkin' })
		}
	}

	return (
		<Container>
			<h1 className="app-title">NEVERWAIT</h1>

			<img src={splashImage} className="splash-image" />

			<div className="actions">
				<Button onClick={handleCheckin} style={{ width: '100%', marginBottom: 28 }}>
					CHECK IN
				</Button>

				<Button onClick={handleCreateAppointment} style={{ width: '100%' }}>
					CREATE APPOINTMENT
				</Button>
			</div>

			<NavFooter />
		</Container>
	)
}

export default HomeScreen
