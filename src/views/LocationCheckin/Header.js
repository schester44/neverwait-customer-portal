import React from 'react'
import styled, { css } from 'styled-components'
import { FiArrowLeft, FiCheck } from 'react-icons/fi'
import { darken } from 'polished'

const Container = styled('div')`
	width: 100%;
	position: absolute;
	top: 0;
	left: 0;
	height: 150px;
	padding: 10px 5px;
	font-size: 90%;
	color: white;

	.details {
		padding-left: 10px;
	}

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
`

function renderStepTitle({ isAppointment, step, loggedIn }) {
	switch (step) {
		case 1:
			return 'Select Services'

		case 2:
			if (isAppointment) return 'Select Date & Time'

			return !loggedIn ? 'Login' : 'Review and Confirm'
		case 3:
			return (
				<span>
					Confirmed <FiCheck color="rgba(124, 191, 74, 1.0)" />
				</span>
			)
		default:
			return null
	}
}

const Header = ({ isAppointment, stepModifier, step, loggedIn, title, showBack = true, onBack }) => {
	const displayStep = step + stepModifier

	return (
		<Container>
			{showBack && (
				<div className="back" onClick={onBack}>
					<FiArrowLeft />
				</div>
			)}

			{(step !== 2 || (step === 2 && loggedIn)) && (
				<div className="details">
					{step && displayStep <= 3 && <span>Step {displayStep} of 3</span>}
					<h1>{title || renderStepTitle({ step, loggedIn, isAppointment })}</h1>
				</div>
			)}
		</Container>
	)
}

export default Header
