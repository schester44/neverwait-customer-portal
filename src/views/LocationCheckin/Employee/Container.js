import styled, { css } from 'styled-components'

const themeStyles = ({ theme }) => css`
	background: white;

	button {
		background: ${theme.colors.success};
		color: white;
	}
`

export default styled('div')`
	margin-bottom: 20px;
	border-radius: 8px;

	width: 100%;
	box-shadow: 0px 0px 8px rgba(32, 32, 32, 0.05);
	border: 1px solid transparent;
	cursor: pointer;
	opacity: 1;

	&:hover {
		border: 1px solid ${({ theme }) => theme.colors.brand};
	}

	.main {
		padding: 10px;

		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.status {
		background: rgba(249, 249, 249, 0.8);
		padding: 10px 10px 6px 10px;

		.wait-time {
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;

			.accepts {
				padding-bottom: 3px;
			}
		}
	}

	.right {
		display: flex;
		align-items: center;
		position: relative;
	}

	h1 {
		line-height: 1.2;
		font-size: 24px;
	}

	button {
		border: 0;
		border-radius: 3px;
		padding: 12px;
		color: rgba(38, 43, 49, 1);
		line-height: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		font-weight: 700;
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
