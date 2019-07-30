import React from "react"
import styled from "styled-components"

const StyledBtn = styled("button")`
	width: 100%;
	padding: 30px 10px;
	margin: 50px auto 15px auto;
	border: 0;
	background: rgba(242, 209, 116, 1);
	color: black;
	border-radius: 3px;
	font-size: 18px;
	text-align: center;
	border: none;

	&:disabled {
		transition: opacity 1s ease;
		cursor: not-allowed;
		opacity: 0.2;
	}
`

const Button = props => {
	return <StyledBtn {...props}>{props.children}</StyledBtn>
}

export default Button
