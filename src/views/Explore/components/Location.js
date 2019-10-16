import React from 'react'
import { generatePath, Link, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { LOCATION_WAITLIST } from '../../../routes'

const Container = styled('div')`
	border-radius: 8px;
	background: rgba(46, 50, 53, 1);
	box-shadow: 0px 2px 3px rgba(32, 32, 32, 0.2);
	padding: 20px;
	margin-bottom: 16px;

	h1 {
		color: rgba(233, 209, 140, 1);
	}
`

const Location = ({ location }) => {
	const routerLocation = useLocation()

	return (
		<Link
			to={{
				pathname: generatePath(LOCATION_WAITLIST, { uuid: location.uuid }),
				state: { from: routerLocation.pathname }
			}}
		>
			<Container>
				<h1>{location.name}</h1>
				<h3>{location.address}</h3>
			</Container>
		</Link>
	)
}

export default Location
