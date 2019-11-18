import React from 'react'
import styled from 'styled-components'
import { FiX } from 'react-icons/fi'

const Container = styled('div')`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100vh;
	background: ${({ theme }) => theme.colors.bodyBg};
	color: ${({ theme }) => theme.colors.bodyColor};
	display: flex;
	flex-direction: column;
	overflow: scroll;
	-webkit-overflow-scrolling: touch;
	padding: 10px;
	z-index: 99;

	.title {
		width: 100%;
		text-align: center;
		padding: 24px;
		font-size: 22px;
	}

	.close {
		position: fixed;
		top: 10px;
		right: 10px;
		cursor: pointer;
		font-size: 24px;
		z-index: 999;
	}

	@media (min-width: 1200px) {
		.close {
			left: 1160px;
		}
	}

	.contents {
		margin-top: 28px;
		width: 100%;
		flex: 1;
		padding-bottom: 20px;
	}
`

const Modal = ({ children, title, onClose }) => {
	return (
		<Container>
			{typeof onClose !== 'undefined' && (
				<div className="close" onClick={onClose}>
					<FiX />
				</div>
			)}
			{title && <div className="title">{title}</div>}

			<div className="contents">{children}</div>
		</Container>
	)
}

export default Modal
