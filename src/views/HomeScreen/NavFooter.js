import React from 'react'

import { NavLink } from 'react-router-dom'
import styled, { keyframes, css } from 'styled-components'

import { FiUser, FiSettings, FiScissors } from 'react-icons/fi'
import { LOCATION_SEARCH, USER_PREFERENCES } from '../../routes'

const themeStyles = ({ theme }) => css`
	background: ${theme.colors.headerBg};
	box-shadow: 0 -2px 5px ${theme.colors.shadow};
`

const slideUp = keyframes`
	from {
		opacity: 1;
		transform: translateY(80px);
	}
	to {
		opacity: 1;
		transform: translateY(0px);
	}
`

const animateStyles = ({ animate }) =>
	animate &&
	css`
		animation: ${slideUp} 0.5s 0.3s ease forwards;
		opacity: 0;
	`

const highlightStyles = ({ highlight }) =>
	highlight &&
	css`
		border-radius: 50px;
		flex-direction: column;
		line-height: 1;
		width: 80px;
		height: 80px;
		justify-content: center;
		margin: -40px auto 0 auto;
		background: rgba(242, 209, 116, 1);
		color: rgba(26, 30, 32, 1);
	`

const Button = styled('button')`
	cursor: pointer;
	font-size: 24px;
	height: 100%;
	display: flex;
	align-items: center;
	background: transparent;
	color: #fff;
	border: 0;

	${highlightStyles};
`

const Container = styled('div')`
	position: fixed;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 20px 0;
	bottom: 0;
	left: 0;
	width: 100%;

	a {
		flex: 1;

		&:not(:last-of-type) {
			border-right: 1px solid rgba(200, 200, 200, 0.1);
		}

		&.active {
			.action {
				.text {
					color: rgba(237, 209, 129, 1);
					opacity: 1;
				}
			}
		}
	}

	.action {
		font-size: 24px;
		height: 100%;
		display: flex;
		align-items: center;
		flex-direction: column;
		justify-content: center;
		width: 100%;

		.text {
			padding-top: 4px;
			font-size: 12px;
			font-weight: 500;
			opacity: 0.5;
		}
	}

	${animateStyles};
	${themeStyles};
`

const NavFooter = ({ animate = false, highlightCheckin = false }) => {
	return (
		<Container className="app-nav-footer" animate={animate}>
			<NavLink to="/profile/appointments">
				<div className="action">
					<FiUser />
					<span className="text">Appointments</span>
				</div>
			</NavLink>

			<NavLink to={LOCATION_SEARCH}>
				{highlightCheckin ? (
					<Button highlight={true}>
						<FiScissors />
						<div style={{ fontSize: 10, marginTop: 4, fontWeight: 700, opacity: 0.8 }}>CHECK-IN</div>
					</Button>
				) : (
					<div className="action">
						<FiScissors />
						<span className="text">Check-in</span>
					</div>
				)}
			</NavLink>

			<NavLink to={USER_PREFERENCES}>
				<div className="action">
					<FiSettings />
					<span className="text">Settings</span>
				</div>
			</NavLink>
		</Container>
	)
}

export default NavFooter
