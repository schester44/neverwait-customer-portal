import styled from 'styled-components'

export default styled('div')`
	margin: 25px 0;
	background: rgba(37, 43, 50, 1);
	padding: 10px 20px;
	display: flex;
	justify-content: space-between;
	align-items: center;

	.right {
		display: flex;
		align-items: center;
	}

	h1 {
		font-size: 28px;
	}

	h4 {
		font-size: 14px;
		font-weight: 400;
	}

	button {
		border: 0;
		border-radius: 3px;
		padding: 8px 12px;
		font-size: 16;
		background: rgba(242, 209, 116, 1);
		color: black;
		box-shadow: 2px 3px 3px rgba(32, 32, 32, 0.3);
		line-height: 1;
		display: flex;
		align-items: center;
		justify-content: center;
	}
`
