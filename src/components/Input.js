import React, { useRef } from 'react'
import styled from 'styled-components'

const themeStyles = ({ theme }) => `
	input {
		background: ${theme.colors.inputBg};
		color: ${theme.colors.inputColor};
		box-shadow: 1px 1px 2px rgba(32,32,32, 0.1), 0px 1px 5px rgba(32,32,32,0.05);
		-webkit-appearance: none;

		&:focus,&:hover {
			border: 1px solid ${theme.colors.brand};
		}
	}
`

const Wrapper = styled('div')`
	width: 100%;
	text-align: left;
	position: relative;

	label {
		text-transform: uppercase;
		font-size: 12px;
		font-weight: 600;
		margin: 0;
		line-height: 1;
		opacity: 0.6;
		letter-spacing: 1px;
	}

	.input-wrapper {
		width: 100%;
		padding-top: 6px;
	}

	input {
		font-size: 16px;
		border-radius: 5px;
		width: 100%;
		outline: none;
		padding: 20px;
		font-weight: 400;
		border: 1px solid transparent;
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
