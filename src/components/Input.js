import React, { useRef } from "react"
import styled from "styled-components"

const Wrapper = styled("div")`
	width: 100%;
	text-align: left;
	position: relative;

	label {
		position: absolute;
		transform: translate(20px, 57px);
		text-transform: uppercase;
		color: rgba(250, 250, 250, 0.4);
		font-size: 32px;
		font-weight: 300;
		transition: all 0.5s ease;
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
			<div className="input-wrapper">
				<input ref={ref} value={value} {...props} />
			</div>
		</Wrapper>
	)
}

export default Input
