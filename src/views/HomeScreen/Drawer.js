import React from 'react'
import styled, { keyframes } from 'styled-components'

const slideUp = keyframes`
    from {
        transform: translateY(100vh);
    }
    to {
        transform: translateY(0px);
    }
`

const themeStyles = ({ theme }) => `
	background: ${theme.colors.headerBg};
	box-shadow: 0px -10px 20px ${theme.colors.shadow};
	border-top-left-radius: ${theme.borderRadius.medium};
	border-top-right-radius: ${theme.borderRadius.medium};
	color: ${theme.colors.bodyColor};
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
`

const Drawer = ({ title, children }) => {
	return (
		<Container>
			{title && <div className="title">{title}</div>}
			{children}
		</Container>
	)
}

export default Drawer
