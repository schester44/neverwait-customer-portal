import styled from 'styled-components'

export default styled('div')`
	margin: 25px 0;
	background: rgba(37, 43, 50, 1);
	color: white;
	padding: 10px 20px;
	border-radius: 8px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	cursor: pointer;

	&:hover {
		background: rgba(57, 63, 70, 1);
	}

	.right {
		display: flex;
		align-items: center;
	}

	h1 {
		line-height: 1;
		font-size: 24px;
	}

	p {
		font-size: 16px;
		padding-top: 5px;
		opacity: 0.5;
	}

	button {
		border: 0;
		border-radius: 3px;
		padding: 8px 12px;
		font-size: 16px;
		background: rgba(242, 209, 116, 1);
		color: rgba(38, 43, 49, 1);
		box-shadow: 2px 3px 3px rgba(32, 32, 32, 0.3);
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
`
