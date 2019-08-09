import React from 'react'
import styled, { keyframes, css } from 'styled-components'
import useOutsideClick from '@rooks/use-outside-click'

const slideUp = keyframes`
    from {
        transform: translateY(100vh);
    }
    to {
        transform: translateY(0px);
    }
`

const slideDown = keyframes`
    from {
        transform: translateY(0px);
    }
    to {
        transform: translateY(100vh);
    }
`
const themeStyles = ({ theme }) => `
	background: ${theme.colors.headerBg};
	box-shadow: 0px -10px 20px ${theme.colors.shadow};
	border-top-left-radius: ${theme.borderRadius.medium};
	border-top-right-radius: ${theme.borderRadius.medium};
	color: ${theme.colors.bodyColor};
`

const leaveStyles = ({ leave }) =>
	leave &&
	css`
		animation: ${slideDown} 0.5s ease forwards;
	`

const Container = styled('div')`
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	padding: 10px;
	z-index: 1;
	height: 80vh;
	max-height: 250px;
	animation: ${slideUp} 0.3s ease forwards;

	@media (min-width: 900px) {
		max-width: 500px;
		left: calc(50% - 250px);
	}

	.title {
		text-align: center;
		margin-bottom: 16px;
	}

	${themeStyles}
	${leaveStyles}
`

const Drawer = ({ onClose, title, children }) => {
	const ref = React.useRef()
	const [leave, setLeave] = React.useState(false)

	const handleOutsideClick = () => {
		setLeave(true)
		window.setTimeout(() => {
			onClose()
		}, 200)
	}

	useOutsideClick(ref, handleOutsideClick)

	return (
		<Container leave={leave} ref={ref}>
			{title && <div className="title">{title}</div>}
			{children}
		</Container>
	)
}

export default Drawer
