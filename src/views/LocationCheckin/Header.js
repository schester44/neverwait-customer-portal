import React from 'react'
import styled, { css, keyframes } from 'styled-components'
import { FiArrowLeft, FiCheckCircle } from 'react-icons/fi'
import { darken } from 'polished'

const headerSlideDown = keyframes`
	from {
		transform: translateY(-120px);
	}
	to {
		transform: translateY(0px);
	}
`

const bounce = keyframes`
		0% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-5px);
		}
		100% {
			transform: translateY(0);
		}
`

const confirmedStyles = ({ confirmed, theme }) =>
	confirmed &&
	css`
		transition: all 0.5s ease;
		height: 70px;
		background-image: linear-gradient(${theme.colors.success}, ${darken(0.1, theme.colors.success)});
	`

const Container = styled('div')`
	${({ step }) =>
		step === 1 &&
		css`
			animation: ${headerSlideDown} 0.4s ease forwards;
		`}

	width: 100%;
	position: absolute;
	top: 0;
	left: 0;
	height: 90px;
	padding: 10px 5px;
	font-size: 90%;
	color: white;
	display: flex;

	${({ theme }) => css`
		background-image: linear-gradient(${theme.colors.brand}, ${darken(0.05, theme.colors.brand)});
	`};

	clip-path: polygon(0 0, 100% 0, 100% 100%, 0 calc(100% - 20px));

	.back {
		font-size: 36px;
		padding-right: 14px;
		line-height: 1;
		padding-bottom: 10px;
	}

	.details {
		flex: 1;
	}

	.confirmed {
		padding-left: 10px;

		.icon {
			animation: ${bounce} 2s linear infinite;
			margin-bottom: -7px;
		}
	}

	${confirmedStyles};
`

function renderStepTitle({ isAppointment, step, loggedIn }) {
	switch (step) {
		case 1:
			return 'Select Services'

		case 3:
			if (isAppointment) return 'Select Date & Time'

			return !loggedIn ? 'Login' : 'Review and Confirm'
		case 4:
			return (
				<div className="confirmed">
					<span style={{ paddingRight: 10 }}>Confirmed</span>
					<FiCheckCircle className="icon" />
				</div>
			)
		default:
			return null
	}
}

const Header = ({ isAppointment, step, loggedIn, title, showBack = true, onBack }) => {
	return (
		<Container confirmed={step === 4} animate={step === 1}>
			{showBack && (
				<div className="back" onClick={onBack}>
					<FiArrowLeft />
				</div>
			)}

			{(step !== 2 || (step === 2 && loggedIn)) && (
				<div className="details">
					{step && step <= 3 && <span>Step {step} of 3</span>}
					<h1>{title || renderStepTitle({ step, loggedIn, isAppointment })}</h1>
				</div>
			)}
		</Container>
	)
}

export default Header
