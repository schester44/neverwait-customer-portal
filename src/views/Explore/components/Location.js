import React from 'react'
import { generatePath, Link, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { LOCATION_CHECKIN } from '../../../routes'

const Container = styled('div')`
	border-radius: 8px;
	background: white;
	box-shadow: 0px 1px 2px rgba(32, 32, 32, 0.1);
	padding: 20px;
	margin-bottom: 16px;

	h1 {
		color: ${({ theme }) => theme.colors.bodyColor};
	}
`

const Location = ({ location }) => {
	const routerLocation = useLocation()

	console.log(routerLocation)

	return (
		<Link
			to={{
				pathname: generatePath(LOCATION_CHECKIN, { uuid: location.uuid }),
				state: { from: routerLocation.pathname }
			}}
		>
			<Container>
				<h1>{location.name}</h1>
				<p className="small-sub-text">{location.address}</p>
			</Container>
		</Link>
	)
}

export default Location
