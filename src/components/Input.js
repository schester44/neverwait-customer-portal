import React, { useRef } from 'react'
import styled from 'styled-components'
import { shade } from 'polished'

const themeStyles = ({ theme }) => `
	input {
		background: ${theme.colors.inputBg};
		color: ${theme.colors.inputColor};

		&:focus,&:active,&:hover {
			background: ${shade(0.05, theme.colors.inputBg)};
		}
	}
`

const Wrapper = styled('div')`
	width: 100%;
	text-align: left;
	position: relative;

	label {
		text-transform: uppercase;
		font-size: 16px;
		font-weight: 300;
		margin: 0;
		line-height: 1;
		opacity: 0.6;
	}

	.input-wrapper {
		width: 100%;
		padding-top: 10px;
	}

	input {
		font-size: 16px;
		border: 0;
		border-radius: 5px;
		width: 100%;
		outline: none;
		padding: 20px;
		font-weight: 400;
	}

	${themeStyles};
`

const Input = ({ value, label, style = {}, ...props }) => {
	const ref = useRef(null)

	return (
		<Wrapper
			style={style}
			onClick={() => {
				ref.current.focus()
			}}
		>
			{label && <label>{label}</label>}
			<div className="input-wrapper">
				<input ref={ref} value={value} {...props} />
			</div>
		</Wrapper>
	)
}

export default Input
