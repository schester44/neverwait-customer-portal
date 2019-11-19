import React from 'react'
import styled, { keyframes } from 'styled-components'

const anim = keyframes`
	0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
`

const Container = styled('div')`
	position: fixed;
	top: 10px;
	right: 10px;
	z-index: 9999;

	.loader {
		display: inline-block;
		position: relative;
		width: 64px;
		height: 64px;
		div {
			box-sizing: border-box;
			display: block;
			position: absolute;
			width: 51px;
			height: 51px;
			margin: 6px;
			border: 6px solid transparent;
			border-radius: 50%;
			animation: ${anim} 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
			border-color: red transparent transparent transparent;
		}
		div:nth-child(1) {
			animation-delay: -0.45s;
		}
		div:nth-child(2) {
			animation-delay: -0.3s;
		}
		div:nth-child(3) {
			animation-delay: -0.15s;
		}
	}
`

const LoadingIcon = () => {
	return (
		<Container>
			<div className="loader">
				<div></div>
				<div></div>
				<div></div>
				<div></div>
			</div>
		</Container>
	)
}

export default LoadingIcon
