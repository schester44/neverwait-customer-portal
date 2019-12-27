import React from 'react'
import Background from './HomeScreen/HomeScreenBackground'
import styled from 'styled-components'

const Container = styled('div')`
	overflow: hidden;
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;

	.loader,
	.loader:after {
		border-radius: 50%;
		width: 10em;
		height: 10em;
	}
	.loader {
		margin: 60px auto;
		font-size: 10px;
		position: relative;
		text-indent: -9999em;
		border-top: 1.1em solid rgba(104, 109, 230, 0.2);
		border-right: 1.1em solid rgba(104, 109, 230, 0.2);
		border-bottom: 1.1em solid rgba(104, 109, 230, 0.2);
		border-left: 1.1em solid rgba(104, 109, 230, 1);
		transform: translateZ(0);
		animation: load8 1.1s infinite linear;
	}

	@-webkit-keyframes load8 {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
	@keyframes load8 {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
`

const LoadingScreen = ({ animate = true }) => {
	return (
		<Container>
			{animate && <Background showSplash={false} />}
			<div className="loader">Loading...</div>
		</Container>
	)
}

export default LoadingScreen
