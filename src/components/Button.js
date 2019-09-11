import React from 'react'
import styled, { css } from 'styled-components'

const sizeStyles = ({ type, size }) =>
	size === 'small'
		? css`
				padding: 6px 10px;
				font-size: 16px;
		  `
		: css`
				padding: 10px;
				font-size: 18px;
		  `

const ghostStyles = ({ ghost }) =>
	ghost &&
	css`
		background: transparent;
		border: 1px solid rgba(242, 209, 116, 1);
		color: rgba(242, 209, 116, 1);
	`

const StyledBtn = styled('button')`
	border: 0;
	background: rgba(242, 209, 116, 1);
	color: black;
	border-radius: 3px;
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

	${ghostStyles}
`

const Button = props => {
	return <StyledBtn {...props}>{props.children}</StyledBtn>
}

export default Button
