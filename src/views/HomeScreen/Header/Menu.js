import styled from 'styled-components'

const Menu = styled('div')`
	list-style: none;
	display: flex;
	justify-content: space-around;
	align-items: flex-end;
	background: ${({ theme }) => theme.colors.headerBg};
	border-radius: 25px;
	margin: 8px 10px 10px 10px;
	box-shadow: 0px 1px 3px rgba(32, 32, 32, 0.02), 0px 1px 5px rgba(32, 32, 32, 0.02);

	a {
		> div {
			border-bottom: 2px solid transparent;
			opacity: 0.7;
		}

		&.active > div {
			opacity: 1;
			color: ${({ theme }) => theme.colors.brandSecondary};
			border-bottom: 2px solid ${({ theme }) => theme.colors.brandSecondary};
		}
	}
`

Menu.Item = styled('div')`
	height: 100%;
	padding: 12px 20px;
	cursor: pointer;
	opacity: 0.8;
	border-bottom: 3px solid transparent;
	letter-spacing: 1px;
	font-size: 12px;
	font-weight: 700;
`

export default Menu
