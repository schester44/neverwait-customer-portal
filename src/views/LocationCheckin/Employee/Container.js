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
		background: rgba(54, 66, 150, 0.05);
		border: 1px solid rgba(54, 66, 150, 0.05);
		border-top: 1px solid rgba(54, 66, 150, 0.075);
		border-bottom-left-radius: 8px;
		border-bottom-right-radius: 8px;
		width: calc(100% + 2px);
		border-top-right-radius: 80%;
		margin-left: -1px;
		margin-bottom: -1px;

		padding: 10px;
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
		font-size: 16px;
		color: rgba(38, 43, 49, 1);
		line-height: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		position: relative;
		top: 5px;
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
