import React from 'react'
import styled, { keyframes, css } from 'styled-components'

const enter = keyframes`
	from {
		transform: translateY(60px);
	}
	to {
		transform: translateY(0px);
	}
`

const flexStyles = ({ flex }) =>
	flex &&
	css`
		display: flex;
		flex-direction: row-reverse;
		justify-content: space-between;
		align-items: center;

		.action {
			padding-left: 10px;
			display: flex;
			justify-content: flex-end;
			flex: 1;
		}
	`

const Container = styled('div')`
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	max-width: 1200px;

	padding: 17px 10px 20px 10px;
	margin: 0 auto;
	z-index: 99;

	animation: ${enter} 0.4s ease forwards;

	background: white;
	box-shadow: 0px -3px 30px rgba(32, 32, 32, 0.1), 0px -2px 5px -2px rgba(32, 32, 32, 0.1);

	@media (min-width: 1200px) {
		left: calc(50% - 600px);
		padding: 20px;
	}

	${flexStyles};
`

const FormFooter = ({ action, children }) => {
	return (
		<Container flex={!!action && !!children}>
			{action && <div className="action">{action}</div>}
			{children && <div className="children">{children}</div>}
		</Container>
	)
}

export default FormFooter
