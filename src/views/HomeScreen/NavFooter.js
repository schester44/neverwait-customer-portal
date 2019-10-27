import React from 'react'

import { NavLink } from 'react-router-dom'
import styled, { keyframes, css } from 'styled-components'

import { FiUser, FiSettings, FiScissors } from 'react-icons/fi'
import { LOCATION_SEARCH, USER_PREFERENCES } from '../../routes'
import { transparentize } from 'polished'

const themeStyles = ({ theme }) => css`
	.contents {
		border-top: 1px solid ${theme.colors.shadow};
		background: ${theme.colors.headerBg};
	}
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

const highlightStyles = ({ highlight, theme }) =>
	highlight &&
	css`
		border-radius: 50px;
		flex-direction: column;
		line-height: 1;
		width: 65px;
		height: 65px;
		justify-content: center;
		margin: -60px auto 0 auto;
		background: ${theme.colors.brand};
		color: white;
		border: 5px solid rgba(255, 255, 255, 1);
		box-shadow: 0px 0px 0px 8px ${transparentize(0.9, theme.colors.brand)}, 1px 1px 3px rgba(32, 32, 32, 0.05);

		.text {
			font-size: 8px;
			margin-top: 4px;
			font-weight: 700;
			opacity: 0.8;
		}
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

	bottom: 0;
	left: 0;
	width: 100%;
	padding: 5px 0;

	.contents {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		max-width: 1200px;
		margin: 0 auto;
	}

	.border-left {
		border-left: 1px solid ${({ theme }) => theme.colors.bodyBg};
	}

	.border-right {
		border-right: 1px solid ${({ theme }) => theme.colors.bodyBg};
	}

	a {
		flex: 1;

		&.active {
			.action {
				.text {
					color: ${({ theme }) => theme.colors.brand};
					opacity: 1;
				}
			}
		}
	}

	.placeholder {
		flex: 1;
		height: 50px;
	}

	.action {
		font-size: 24px;
		height: 100%;
		display: flex;
		align-items: center;
		flex-direction: column;
		justify-content: center;
		width: 100%;
		padding: 5px 0 10px 0;

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

const NavFooter = ({ animate = false, highlightCheckin = false, hideCheckin = false }) => {
	return (
		<Container className="app-nav-footer" animate={animate}>
			<div className="contents">
				<NavLink to="/profile/appointments">
					<div className="action">
						<FiUser />
						<span className="text">Appointments</span>
					</div>
				</NavLink>

				{!hideCheckin && (
					<NavLink className="border-left border-right" to={LOCATION_SEARCH}>
						{highlightCheckin ? (
							<Button highlight={true}>
								<FiScissors />
								<div className="text">
									CHECK
									<br />
									IN
								</div>
							</Button>
						) : (
							<div className="action">
								<FiScissors />
								<span className="text">Check-in</span>
							</div>
						)}
					</NavLink>
				)}

				{hideCheckin && (
					<div className="placeholder border-left border-right">
						<div className="action"></div>
					</div>
				)}

				<NavLink to={USER_PREFERENCES}>
					<div className="action">
						<FiSettings />
						<span className="text">Settings</span>
					</div>
				</NavLink>
			</div>
		</Container>
	)
}

export default NavFooter
