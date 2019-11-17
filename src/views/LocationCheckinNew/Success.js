import React from 'react'
import { Link, generatePath } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'

import { format } from 'date-fns'
import Button from '../../components/Button'
import { USER_APPOINTMENTS } from '../../routes'

const enter = keyframes`
	from {
		transform: translateY(120px);
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

	.mask {
	}

	display: flex;
	justify-content: space-between;
	align-items: center;
	flex-direction: column;

	.info {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-direction: column;
		flex: 1;
	}

	padding: 20px;
	margin: 0 auto;
	z-index: 999;

	@media (min-width: 1200px) {
		max-width: 1200px;
		left: calc(50% - 600px);
	}

	animation: ${enter} 0.2s ease forwards;

	color: ${({ theme }) => theme.colors.bodyBg};
	background: ${({ theme }) => theme.colors.brand};
`

const MulltipleServices = ({ employeeFirstName }) => {
	return <p style={{ textAlign: 'center', fontSize: 14 }}>Checked-in with {employeeFirstName}.</p>
}
const SingleService = ({ service, employeeFirstName }) => (
	<p style={{ textAlign: 'center', fontSize: 14 }}>
		Checked in with {employeeFirstName} for <span style={{ fontWeight: 700 }}>{service}</span>.
	</p>
)

const Success = ({ appointment }) => {
	return (
		<>
			<div
				className="mask"
				style={{
					position: 'fixed',
					width: '100vw',
					height: '100vh',
					top: 0,
					left: 0,
					background: 'rgba(249, 249, 249, .3)'
				}}
			></div>
			<Container>
				<div className="info">
					<h1 style={{ paddingBottom: 16 }}>Success!</h1>

					{appointment.services.length > 1 ? (
						<MulltipleServices employeeFirstName={appointment.employee.firstName} />
					) : (
						<SingleService
							service={appointment.services[0].name}
							employeeFirstName={appointment.employee.firstName}
						/>
					)}

					<h1 style={{ margin: '50px 0', color: 'white' }}>
						You can expect to be in the chair around:{' '}
						<span style={{ color: 'rgba(242, 209, 116, 1)' }}>
							{format(appointment.startTime, 'h:mma')}.
						</span>
					</h1>
				</div>

				<Link
					to={generatePath(USER_APPOINTMENTS, { type: 'upcoming' })}
					style={{ width: '100%', display: 'block' }}
				>
					<Button inverted style={{ width: '100%' }}>
						Finish
					</Button>
				</Link>
			</Container>
		</>
	)
}

export default Success
