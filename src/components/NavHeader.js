import React from 'react'
import styled, { css } from 'styled-components'
import { useHistory } from 'react-router-dom'

import { FiArrowLeft } from 'react-icons/fi'

const Container = styled('div')(
	props => css`
		.back-btn {
            max-width: 50px;
			font-size: 32px;
			padding: 14px;
			line-height: 1;
			color: ${props.theme.colors.n450};
		}
	`
)

const NavHeader = ({ content, onBack, showBack = true }) => {
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
			{showBack && (
				<div className="back-btn" onClick={handleBackBtn}>
					<FiArrowLeft />
				</div>
			)}

			{content && content}
		</Container>
	)
}

export default NavHeader
