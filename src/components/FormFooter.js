import styled from 'styled-components'

const FormFooter = styled('div')`
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	max-width: 1200px;

	display: flex;
	justify-content: space-between;
	align-items: center;

	padding: 15px 25px 25px 25px;
	margin: 0 auto;
	z-index: 99;

	background: ${({ theme }) => theme.colors.headerBg};
	color: ${({ theme }) => theme.colors.headerColor};

	@media (min-width: 1200px) {
		left: calc(50% - 600px);
		padding: 20px;

		span {
			font-size: 20px;
		}
	}
`

export default FormFooter
