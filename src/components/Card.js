import styled from 'styled-components'

export default styled('div')`
	margin: 5px 0;
	border-radius: 8px;

	.inverted {
		background: white;
		box-shadow: 0px 1px 3px rgba(32, 32, 32, 0.05);
		border-radius: 10px;
		padding: 10px;
	}

	.title {
		font-size: 12px;
		font-weight: 700;
		padding-top: 5px;
		padding-bottom: 15px;
		opacity: 0.7;
	}
`
