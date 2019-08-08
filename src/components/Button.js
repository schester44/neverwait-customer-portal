import React from 'react'
import styled, { css } from 'styled-components'

const sizeStyles = ({ type }) => css`
	padding: 10px;
	font-size: 18px;
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
`

const Button = props => {
	return <StyledBtn {...props}>{props.children}</StyledBtn>
}

export default Button
