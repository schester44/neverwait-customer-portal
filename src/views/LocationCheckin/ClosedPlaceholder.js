import React from 'react'
import styled from 'styled-components'
import { FiClock, FiArrowLeft } from 'react-icons/fi'
import { useHistory } from 'react-router-dom'

const Container = styled('div')`
	width: 100%;
	height: 100vh;
	display: flex;
	flex-direction: column;
	overflow: hidden;

	.address {
		font-size: 12px;
		text-transform: uppercase;
		font-weight: 700;
		opacity: 0.7;
		line-height: 1.5;
	}

	.header {
		width: 100%;
		padding: 24px 20px;
		margin-bottom: 24px;

		.back {
			position: relative;
			font-size: 36px;
			line-height: 1;
			padding-right: 16px;
			cursor: pointer;
		}
	}

	.reason {
		flex: 1;
		max-height: 60vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	@media (min-width: 768px) {
		.header {
			display: flex;
			justify-content: center;
			align-items: center;
		}

		.reason {
			flex: 0;
		}
	}
`

const ClosedPlaceholder = ({ location, reason }) => {
	const history = useHistory()

	return (
		<Container>
			<div className="header">
				<div
					className="back"
					onClick={() => {
						history.push(history.location.state?.from || '/')
					}}
				>
					<FiArrowLeft />
				</div>

				<div>
					<h1 className="header-title">{location.name}</h1>
					<p className="address">{location.address}</p>
				</div>
			</div>

			<div className="reason">
				<FiClock size="100" />
				<h1>Closed Now</h1>
				{reason && <h3>{reason}</h3>}
			</div>
		</Container>
	)
}

export default ClosedPlaceholder
