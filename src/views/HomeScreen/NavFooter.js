import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { FiMapPin, FiX } from 'react-icons/fi'

const Drawer = React.lazy(() => import('./Drawer'))

const themeStyles = ({ theme }) => `
	background: ${theme.colors.headerBg};
	box-shadow: 0 -2px 5px ${theme.colors.shadow};

	.button {
		background: ${theme.colors.p500};
		color: ${theme.colors.n100};
		box-shadow: 0px -2px 3px ${theme.colors.shadow};
	}
`

const Container = styled('div')`
	position: fixed;

	bottom: 0;
	left: 0;
	width: 100%;
	height: 50px;

	.button {
		cursor: pointer;
		position: absolute;
		z-index: 10;
		top: -20px;
		left: calc(50% - 25px);
		width: 50px;
		height: 50px;
		border-radius: 50%;

		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 28px;
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
