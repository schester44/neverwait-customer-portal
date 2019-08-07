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

const Container = styled('div')`
	position: fixed;
	bottom: 0;
	left: 0;
	background: white;
	width: 100%;
	padding: 10px;
	z-index: 1;
	box-shadow: 0px -10px 20px rgba(32, 32, 32, 0.05);

	border-top-left-radius: 10px;
	border-top-right-radius: 10px;
	height: 80vh;
	max-height: 250px;
	animation: ${slideUp} 0.3s ease forwards;
	color: rgba(25, 30, 33, 1);

    @media (min-width: 900px) {
        max-width: 500px;
        left: calc(50% - 250px);
    }

	.title {
		text-align: center;
		margin-bottom: 16px;
	}
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
