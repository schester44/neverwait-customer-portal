import React from 'react'
import { Link } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'
import { FiMapPin, FiX } from 'react-icons/fi'

const slideUp = keyframes`
    from {
        transform: translateY(100vh);
    }
    to {
        transform: translateY(0px);
    }
`

const Container = styled('div')`
	position: fixed;

	bottom: 0;
	left: 0;
	width: 100%;
	height: 50px;
	background: #fff;

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

const Drawer = styled('div')`
	position: fixed;
	bottom: 0;
	left: 0;
	background: white;
	width: 100%;
	padding: 10px;
	z-index: 1;
	box-shadow: 0px -10px 20px rgba(32, 32, 32, 0.5);

	border-top-left-radius: 10px;
	border-top-right-radius: 10px;
	height: 80vh;
	max-height: 250px;
	animation: ${slideUp} 0.3s ease forwards;
	color: rgba(25, 30, 33, 1);

	.title {
		text-align: center;
		margin-bottom: 16px;
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
			{visible && (
				<Drawer>
					<h4 className="title">Select A Location</h4>
					{locations.map(location => {
						console.log(`/book/l/${location.uuid}`)
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
		</Container>
	)
}

export default NavFooter
