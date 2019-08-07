import React from 'react'
import styled from 'styled-components'
import { FiX } from 'react-icons/fi'

const Container = styled('div')`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(26, 30, 32, 1);

	.title {
		width: 100%;
		text-align: center;
		padding: 24px;
		font-size: 22px;
	}

	.close {
		position: absolute;
		top: 10px;
		right: 10px;
		cursor: pointer;
		font-size: 24px;
	}

	.contents {
		margin-top: 28px;
		width: 100%;
	}
`

const Modal = ({ children, title, onClose }) => {
	return (
		<Container>
			<div className="close" onClick={onClose}>
				<FiX />
			</div>
			{title && <div className="title">{title}</div>}

			<div className="contents">{children}</div>
		</Container>
	)
}

export default Modal
