import React from 'react'
import { generatePath, Link, useLocation } from 'react-router-dom'
import { LOCATION_OVERVIEW } from '../../../routes'

const Location = ({ location }) => {
	const routerLocation = useLocation()

	return (
		<Link
			to={{
				pathname: generatePath(LOCATION_OVERVIEW, { uuid: location.uuid }),
				state: { from: routerLocation.pathname }
			}}
		>
			<div className="mb-2 cursor-pointer hover:bg-gray-300 bg-gray-200 rounded-lg px-4 py-4">
				<h3 className="font-bold text-xl text-gray-900">{location.name}</h3>
				<p className="text-sm text-gray-600">{location.address}</p>
			</div>
		</Link>
	)
}

export default Location
