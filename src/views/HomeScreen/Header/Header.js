import React from 'react'
import styled from 'styled-components'

const Container = styled('div')`
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 80px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	box-shadow: 0px 3px 10px rgba(26, 30, 32, 0.05);
	overflow: hidden;
	transition: height 0.3s ease;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	z-index: 2;
	background: white;
	color: rgba(26, 30, 32, 1);
	padding-top: 10px;
	text-align: center;

	border-bottom-left-radius: 25px;
	border-bottom-right-radius: 25px;



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
