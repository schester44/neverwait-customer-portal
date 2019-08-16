import React from 'react'
import styled from 'styled-components'
import { FiChevronLeft, FiCheck } from 'react-icons/fi'

const Container = styled('div')`
	width: 100%;
	padding: 10px 5px;
	font-size: 90%;
	color: ${({ theme }) => theme.colors.n100};

	.back {
		font-size: 36px;
		padding-right: 14px;
		line-height: 1;
		padding-bottom: 10px;
	}
`

function renderStepTitle({ step, loggedIn }) {
	switch (step) {
		case 1:
			return 'Select a service'
		case 2:
			return !loggedIn ? 'Login' : 'Review and confirm'
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

const Header = ({ step, loggedIn, title, showBack = true, onBack }) => {
	const displayStep = step + 1
	return (
		<Container>
			{showBack && (
				<div className="back" onClick={onBack}>
					<FiChevronLeft />
				</div>
			)}

			{(step !== 2 || (step === 2 && loggedIn)) && (
				<div>
					{step && displayStep <= 3 && <span>Step {displayStep} of 3</span>}
					<h1>{title || renderStepTitle({ step, loggedIn })}</h1>
				</div>
			)}
		</Container>
	)
}

export default Header
