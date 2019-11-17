import React from 'react'
import styled from 'styled-components'
import { useParams, useHistory, Link } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'
import { basicLocationInfoQuery } from '../../graphql/queries'
import NavHeader from '../../components/NavHeader'
import { FiCalendar } from 'react-icons/fi'
import NavFooter from '../HomeScreen/NavFooter'
import { format } from 'date-fns'

import ClosingSoon from './ClosingSoon'
import WorkingHour from './WorkingHour'
import Card from '../../components/Card'
import Button from '../../components/Button'

const Container = styled('div')`
	.view {
		display: flex;
		flex-direction: column;
		padding: 14px;
	}
`

const LocationOverview = () => {
	const { uuid } = useParams()
	const history = useHistory()
	const { data, loading } = useQuery(basicLocationInfoQuery, { variables: { uuid } })

	// TODO: handle load state
	if (loading || !data?.locationByUUID) return null

	const location = data.locationByUUID

	const todaysName = format(new Date(), 'dddd').toLowerCase()

	return (
		<Container>
			{!!history.location.state?.from && (
				<NavHeader
					onBack={() => {
						history.push(history.location.state?.from)
					}}
				/>
			)}
			<div
				className="view"
				style={{ height: !!history.location.state?.from ? 'calc(100vh - 100px)' : '100vh' }}
			>
				<h1>{location.name}</h1>
				<p className="small-sub-text">{location.address}</p>

				<p style={{ marginBottom: 24 }} className="small-sub-text">
					{location.contactNumber}
				</p>

				<ClosingSoon today={location.working_hours[todaysName]} />

				<Card>
					<p className="title">
						<FiCalendar style={{ marginRight: 4 }} />
						LOCATION HOURS
					</p>

					<div className="inverted">
						{Object.keys(location.working_hours).map(day => {
							if (day === '__typename') return null

							return (
								<WorkingHour
									isToday={day === todaysName}
									key={day}
									day={day}
									details={location.working_hours[day]}
								/>
							)
						})}
					</div>
				</Card>

				<Card
					style={{
						flex: 1,
						paddingBottom: 65,
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'flex-end',
						width: '100%'
					}}
				>
					<Link to={`${history.location.pathname}/checkin`}>
						<Button style={{ width: '100%', marginBottom: 14 }}>CHECK IN</Button>
					</Link>
					<Link to={`${history.location.pathname}/appointment`}>
						<Button style={{ width: '100%' }}>BOOK APPOINTMENT</Button>
					</Link>
				</Card>
			</div>

			<NavFooter />
		</Container>
	)
}

export default LocationOverview
