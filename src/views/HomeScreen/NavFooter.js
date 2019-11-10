import React from 'react'
import { NavLink } from 'react-router-dom'
import styled, { keyframes, css } from 'styled-components'

import { FiUser, FiScissors, FiCalendar } from 'react-icons/fi'
import { USER_PREFERENCES } from '../../routes'

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

const Container = styled('div')`
	position: fixed;

	bottom: 0;
	left: 0;
	width: 100%;

	.contents {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		max-width: 1200px;
		margin: 0 auto;
		padding-top: 5px;
		padding-bottom: 14px;
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
				color: ${({ theme }) => theme.colors.brand};
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

const NavFooter = ({ animate = false }) => {
	return (
		<Container className="app-nav-footer" animate={animate}>
			<div className="contents">
				<NavLink exact to="/">
					<div className="action">
						<FiScissors />
					</div>
				</NavLink>
				<NavLink to="/profile/appointments">
					<div className="action">
						<FiCalendar />
					</div>
				</NavLink>

				<NavLink to={USER_PREFERENCES}>
					<div className="action">
						<FiUser />
					</div>
				</NavLink>
			</div>
		</Container>
	)
}

export default NavFooter
