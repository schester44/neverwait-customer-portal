import styled, { keyframes } from 'styled-components'

const enter = keyframes`
	from {
		transform: translateY(60px);
	}
	to {
		transform: translateY(0px);
	}
`

const FormFooter = styled('div')`
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	max-width: 1200px;

	display: flex;
	justify-content: space-between;
	align-items: center;

	padding: 17px 10px 40px 10px;
	margin: 0 auto;
	z-index: 99;

	animation: ${enter} .4s ease forwards;
 
	color: ${({ theme }) => theme.colors.bodyBg};
	background: ${({ theme }) => theme.colors.brand};

	.price {
		font-weight: 700;
		font-size: 14px;
	}

	@media (min-width: 1200px) {
		left: calc(50% - 600px);
		padding: 20px;

		span {
			font-size: 20px;
		}
	}
`

export default FormFooter
