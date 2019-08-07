import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { FiMapPin, FiX } from 'react-icons/fi'

const Drawer = React.lazy(() => import('./Drawer'))

const Container = styled('div')`
	position: fixed;

	bottom: 0;
	left: 0;
	width: 100%;
	height: 50px;
	background: #fff;
	box-shadow: 0 -2px 5px rgba(32, 32, 32, 0.05);

	.button {
		cursor: pointer;
		position: absolute;
		z-index: 10;
		top: -20px;
		left: calc(50% - 25px);
		width: 50px;
		height: 50px;
		border-radius: 50%;
		background: rgba(233, 209, 140, 1);
		color: rgba(26, 30, 32, 1);
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 28px;
		box-shadow: 0px -2px 3px rgba(32, 32, 32, 0.1);
	}
`

const Location = styled('div')`
	background: rgba(39, 43, 48, 1);
	color: #fff;
	padding: 15px;
	border-radius: 8px;
	cursor: pointer;

	&:hover {
		background: rgba(45, 50, 53, 1);
	}
`

const NavFooter = ({ locations }) => {
	const [visible, setVisible] = React.useState(false)

	return (
		<Container>
			<div className="button" onClick={() => setVisible(p => !p)}>
				{!visible ? <FiMapPin /> : <FiX />}
			</div>
			<React.Suspense fallback={null}>
				{visible && (
					<Drawer title="Select a location to check in at">
						{locations.map(location => {
							return (
								<Link key={location.uuid} to={`/book/l/${location.uuid}`}>
									<Location>
										<h4>{location.name}</h4>
										<h5>{location.address}</h5>
									</Location>
								</Link>
							)
						})}
					</Drawer>
				)}
			</React.Suspense>
		</Container>
	)
}

export default NavFooter
