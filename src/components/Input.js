import React, { useRef } from 'react'
import styled from 'styled-components'

const Wrapper = styled('div')`
	width: 100%;
	text-align: left;
	position: relative;

	label {
		text-transform: uppercase;
		color: rgba(250, 250, 250, 0.6);
		font-size: 16px;
		font-weight: 300;
		margin: 0;
		line-height: 1;
	}

	.input-wrapper {
		width: 100%;
		padding-top: 10px;
	}

	input {
		font-size: 16px;
		background: rgba(38, 43, 49, 1);
		color: white;
		border: 0;
		border-radius: 5px;
		width: 100%;
		outline: none;
		padding: 20px;
		font-weight: 400;

		&:focus,
		&:active {
			background: rgba(58, 63, 69, 1);
		}
	}
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
