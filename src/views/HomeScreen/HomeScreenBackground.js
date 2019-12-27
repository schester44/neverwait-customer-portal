import React from 'react'
import styled, { keyframes } from 'styled-components'

import { FiScissors } from 'react-icons/fi'
import { TiScissorsOutline } from 'react-icons/ti'
import { FaRegHandScissors } from 'react-icons/fa'

import splashImage from '../../themes/assets/undraw_barber_3uel.svg'

const animation1 = keyframes`
	0% {
		opacity: 0;
		transform: translateY(-100vh);
	}
	10%{
		opacity: 1;
	}
	90% { opacity: 0 }
	100% {
		transform: translateY(100vh);
	}
`

const animation2 = keyframes`
	0% {
		opacity: 0;
		transform: translateX(-100vw);
	}
	10%{
		opacity: 1;
	}
	90% { opacity: 0 }
	100% {
		transform: translateX(100vw);
	}
`

const animation3 = keyframes`
	0% {
		opacity: 0;
		transform: translateX(-100vw);
		transform: translateY(100vh);
	}
	10%{
		opacity: 1;
	}
	90% { opacity: 0 }
	100% {
		transform: translateX(100vw);
		transform: translateY(-100vh);
	}
`

const Container = styled('div')`
	position: fixed;
	width: 100vw;
	height: 100vh;
	overflow: hidden;
	z-index: -1;

	.icon1-0,
	.icon1-2,
	.icon1-4,
	.icon1-6,
	.icon1-8,
	.icon1-10 {
		opacity: 0;
		animation: ${animation1} 10s linear infinite;
	}

	.icon1-1,
	.icon1-3,
	.icon1-5,
	.icon1-7,
	.icon1-9 {
		opacity: 0;
		animation: ${animation3} 10s linear infinite;
	}

	.icon2-0,
	.icon2-2,
	.icon2-4,
	.icon2-6,
	.icon2-8,
	.icon2-10 {
		opacity: 0;
		animation: ${animation2} 10s linear infinite;
	}

	.icon2-1,
	.icon2-3,
	.icon2-5,
	.icon2-7,
	.icon2-9 {
		opacity: 0;
		animation: ${animation3} 10s linear infinite;
	}

	.icon3-0,
	.icon3-2,
	.icon3-4,
	.icon3-6,
	.icon3-8,
	.icon3-10 {
		opacity: 0;
		animation: ${animation2} 10s linear infinite;
	}

	.icon3-1,
	.icon3-3,
	.icon3-5,
	.icon3-7,
	.icon3-9 {
		opacity: 0;
		animation: ${animation1} 10s linear infinite;
	}
`

const Background = ({ showSplash = true }) => {
	return (
		<Container>
			{showSplash && (
				<div style={{ margin: '80px auto', width: '80%', maxWidth: 500 }}>
					<img
						alt="splash"
						src={splashImage}
						style={{ width: '100%', height: '100%', objectFit: 'contain' }}
					/>
				</div>
			)}

			{Array.from({ length: 10 }).map((_, i) => {
				return (
					<FiScissors
						style={{
							position: 'relative',
							left: Math.floor(Math.random() * window.outerWidth) + 1,
							top: Math.floor(Math.random() * window.outerHeight) + 1
						}}
						size="32px"
						key={i}
						className={`text-gray-${i + 1 < 10 ? i + 1 : 1}00 icon1-${i}`}
					/>
				)
			})}

			{Array.from({ length: 10 }).map((_, i) => {
				return (
					<TiScissorsOutline
						style={{
							position: 'relative',
							left: Math.floor(Math.random() * window.outerWidth) + 1,
							top: Math.floor(Math.random() * window.outerHeight) + 1
						}}
						size="32px"
						key={i}
						className={`text-gray-${i + 1 < 10 ? i + 1 : 1}00 icon2-${i}`}
					/>
				)
			})}

			{Array.from({ length: 10 }).map((_, i) => {
				return (
					<FaRegHandScissors
						style={{
							position: 'relative',
							left: Math.floor(Math.random() * window.outerWidth) + 1,
							top: Math.floor(Math.random() * window.outerHeight) + 1
						}}
						size="32px"
						key={i}
						className={`text-gray-${i + 1 < 10 ? i + 1 : 1}00 icon3-${i}`}
					/>
				)
			})}
		</Container>
	)
}

export default Background
