import styled, { css } from 'styled-components'

const themeStyles = ({ theme }) => css`
	background: white;

	button {
		background: ${theme.colors.success};
		color: white;
	}
`

export default styled('div')`
	margin-bottom: 8px;
	padding: 10px;
	border-radius: 8px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	box-shadow: 0px 1px 2px rgba(32, 32, 32, 0.05);

	${({ canSchedule, theme }) =>
		canSchedule &&
		css`
			border: 1px solid transparent;
			cursor: pointer;
			opacity: 1;

			&:hover {
				border: 1px solid ${theme.colors.brand};
			}
		`}

	.right {
		display: flex;
		align-items: center;
	}

	h1 {
		line-height: 1.2;
		font-size: 24px;
	}

	p {
		font-size: 12px;
		line-height: 1.5;
		text-transform: uppercase;
		opacity: 0.7;
		font-weight: 700;
	}

	button {
		border: 0;
		border-radius: 3px;
		padding: 8px 12px;
		font-size: 16px;
		color: rgba(38, 43, 49, 1);
		line-height: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
	}

	@media (min-width: 768px) {
		h1 {
			font-size: 36px;
		}
		h4 {
			font-size: 18px;
		}
		button {
			font-size: 36px;
		}
	}

	${themeStyles};
`
