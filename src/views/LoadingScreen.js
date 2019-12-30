import React from 'react'
import styled, { keyframes } from 'styled-components'

const spin = keyframes`
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
`

const Container = styled('div')`
	overflow: hidden;
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	overflow: hidden;

	.loader,
	.loader:after {
		border-radius: 50%;
		width: 5em;
		height: 5em;
	}

	.loader {
		font-size: 10px;
		position: relative;
		text-indent: -9999em;
		border-top: 0.6em solid rgba(104, 109, 230, 0.2);
		border-right: 0.6em solid rgba(104, 109, 230, 0.2);
		border-bottom: 0.6em solid rgba(104, 109, 230, 0.2);
		border-left: 0.6em solid rgba(104, 109, 230, 1);
		animation: ${spin} 1.1s infinite linear;
	}
`

const LoadingScreen = () => {
	return (
		<Container>
			<div className="loader">Loading...</div>
		</Container>
	)
}

export default LoadingScreen
