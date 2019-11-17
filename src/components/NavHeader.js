import React from 'react'
import styled, { css } from 'styled-components'
import { useHistory } from 'react-router-dom'

import { FiArrowLeft } from 'react-icons/fi'

const Container = styled('div')(
	props => css`
		display: flex;
		justify-content: space-between;

		.actions {
			padding: 14px;
			color: ${props.theme.colors.n450};
		}

		.back-btn {
			max-width: 50px;
			font-size: 32px;
			padding: 14px;
			line-height: 1;
			color: ${props.theme.colors.n450};
		}
	`
)

const NavHeader = ({ actions, onBack, showBack = true }) => {
	const history = useHistory()

	const handleBackBtn = () => {
		if (onBack) {
			onBack()
		} else {
			history.goBack()
		}
	}

	return (
		<Container>
			{showBack ? (
				<div className="back-btn" onClick={handleBackBtn}>
					<FiArrowLeft />
				</div>
			) : (
				//  for flexbox
				<div />
			)}
			{actions && (
				<div className="actions">
					{actions.map((action, idx) => (
						<div className="action" key={idx}>
							{action}
						</div>
					))}
				</div>
			)}
		</Container>
	)
}

export default NavHeader
