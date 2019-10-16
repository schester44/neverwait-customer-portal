import React from 'react'
import styled, { css } from 'styled-components'

const sizeStyles = ({ size }) =>
	size === 'small'
		? css`
				padding: 6px 10px;
				font-size: 16px;
		  `
		: css`
				padding: 14px;
				font-size: 18px;
		  `

const ghostStyles = ({ ghost, theme }) =>
	ghost &&
	css`
		background: transparent;
		border: 1px solid ${theme.elements.button.background};
		color: ${theme.elements.button.background};
	`

const successIntentStyles = ({ theme, intent }) => intent === 'success' && `
	background:	${theme.colors.success};
	border: 1px solid ${theme.colors.success};
`

const secondaryIntentStyles = ({ theme, intent }) => intent === 'secondary' && `
	background:	${theme.colors.brandSecondary};
	border: 1px solid ${theme.colors.brandSecondary};
`

const StyledBtn = styled('button')`
	border: 0;
	background: ${({ theme }) => theme.elements.button.background};
	color: ${({ theme }) => theme.elements.button.text};
	border-radius:8px;
	text-align: center;
	cursor: pointer;
	border: none;

	&:disabled {
		transition: opacity 1s ease;
		cursor: not-allowed;
		opacity: 0.2;
	}

	${sizeStyles}

	@media (min-width: 1200px) {
		padding: 20px;
	}

	${ghostStyles};
	${successIntentStyles};
	${secondaryIntentStyles};
`

const Button = props => {
	return <StyledBtn {...props}>{props.children}</StyledBtn>
}

export default Button
