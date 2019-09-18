import React from 'react'
import styled, { css, keyframes } from 'styled-components'

const positionStyles = ({ position, offset }) => css`
    ${position.top &&
			`
        top: ${position.top + offset}px;
    `};

	${position.bottom && `bottom: ${position.bottom};`}
	${position.left && `left: ${position.left};`}
	${position.right && `right: ${position.right};`}
`

const enterAnimation = keyframes`
    from {
        opacity: 0;
        transform: translateY(-20px);
    }

    to {
        opacity: 1;
        transform: translateY(0px);
    }
`

const intentColors = {
	danger: 'tomato',
	info: 'white'
}

const intentStyles = ({ intent }) => css`
	background: ${intentColors[intent]};
`

const Container = styled('div')`
	width: 250px;
	padding: 10px;
	border-radius: 4px;
	background: tomato;
	box-shadow: 0px 2px 8px rgba(32, 32, 32, 0.1);
	position: fixed;
	z-index: 9999;
	color: rgba(26, 30, 32, 1);
	animation: ${enterAnimation} 0.25s ease forwards;

	.title {
		font-size: 15px;
		font-weight: 500;
	}

	.message {
		font-size: 12px;
	}

	${positionStyles}
	${intentStyles};
`

const Pling = ({ intent, position = { top: 10, left: 'calc(50% - 125px)' }, pling, offset = 0, onDismiss }) => {
	React.useEffect(() => {
		let timeout

		timeout = window.setTimeout(() => {
			onDismiss()
		}, pling.duration)

		return () => window.clearTimeout(timeout)
	}, [pling, onDismiss])

	return (
		<Container intent={intent} offset={offset} position={position}>
			{pling.title && <div className="title">{pling.title}</div>}
			{pling.message && <div className="message">{pling.message}</div>}
		</Container>
	)
}

export default Pling
