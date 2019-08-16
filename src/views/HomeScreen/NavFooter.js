import React from 'react'
import { generatePath, Link } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'
import { FiX, FiLogIn } from 'react-icons/fi'
import { WAITLIST_LOCATION } from '../../routes'
import Button from '../../components/Button'

const Drawer = React.lazy(() => import('./Drawer'))

const themeStyles = ({ theme }) => `
	background: ${theme.colors.headerBg};
	box-shadow: 0 -2px 5px ${theme.colors.shadow};

	.close-button {
		background: ${theme.colors.p500};
		color: ${theme.colors.n500};
		box-shadow: 0px -2px 3px ${theme.colors.shadow};
	}
`

const btnAnimation = keyframes`
	from {
		opacity: 0;
		transform: translateY(20px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
`

const Container = styled('div')`
	position: fixed;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 10px;
	bottom: 0;
	left: 0;
	width: 100%;
	height: 80px;

	.close-button {
		cursor: pointer;
		position: absolute;
		z-index: 10;
		bottom: 20px;
		left: calc(50% - 25px);
		width: 50px;
		height: 50px;
		border-radius: 50%;
		opacity: 0;

		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 28px;
		animation: ${btnAnimation} 0.4s 0.3s ease forwards;
	}

	${themeStyles};
`

const locationThemeStyles = ({ theme }) => `
	background: ${theme.colors.n100};
	color: ${theme.colors.n700};

	&:hover {
		background: ${theme.colors.n200};
	}

`

const Location = styled('div')`
	padding: 15px;
	border-radius: 8px;
	cursor: pointer;

	${locationThemeStyles};
`

const NavFooter = ({ disableCheckins = false, locations }) => {
	const [visible, setVisible] = React.useState({ locations: undefined })

	if (disableCheckins) return null

	return (
		<Container>
			{!visible.locations && (
				<Button
					onClick={() => setVisible({ locations: true })}
					style={{ display: 'flex', alignItems: 'center', lineHeight: 1, padding: 20 }}
				>
					<FiLogIn />
					<span style={{ paddingLeft: 8 }}>Check In To Location</span>
				</Button>
			)}

			{visible.locations && (
				<div className="close-button" onClick={() => setVisible({ locations: false })}>
					<FiX />
				</div>
			)}

			<React.Suspense fallback={null}>
				{visible.locations && (
					<Drawer onClose={() => setVisible({ locations: undefined })} title="Select a location to join waitlist">
						{locations.map(location => {
							return (
								<Link key={location.uuid} to={generatePath(WAITLIST_LOCATION, { uuid: location.uuid })}>
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
