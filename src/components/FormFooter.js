import styled from 'styled-components'

const FormFooter = styled('div')`
	position: fixed;
	bottom: 0;
	left: 0;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 10px;
	width: 100%;
	background: rgba(26, 30, 32, 1.0);
	max-width: 898px;
	margin: 0 auto;
	z-index: 99;

	@media (min-width: 900px) {
		left: calc(50% - 449px);
	}
`

export default FormFooter
