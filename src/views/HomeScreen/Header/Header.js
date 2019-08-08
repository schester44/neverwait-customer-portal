import React from 'react'
import styled from 'styled-components'

const themeStyles = ({ theme }) => `
	background: ${theme.colors.headerBg};
	color: ${theme.colors.headerColor};
	box-shadow: 0px 3px 10px ${theme.colors.shadow};
	border-bottom-left-radius: ${theme.borderRadius.large};
	border-bottom-right-radius: ${theme.borderRadius.large};
`

const Container = styled('div')`
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 80px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	overflow: hidden;
	transition: height 0.3s ease;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	z-index: 2;
	padding-top: 10px;
	text-align: center;

	${themeStyles};

	@media (min-width: 900px) {
		border-radius: 0;
	}

	h1 {
		font-size: 18px;
		line-height: 1.5;
	}

	h3 {
		padding-top: 4px;
		font-size: 14px;
		opacity: 0.6;
	}
`

const Header = ({ title, children }) => {
	return (
		<Container className="app-header">
			{title && <h1 className="title">{title}</h1>}
			{children}
		</Container>
	)
}

export default Header
