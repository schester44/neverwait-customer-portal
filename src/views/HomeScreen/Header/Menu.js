import styled from 'styled-components'

const Menu = styled('div')`
	list-style: none;
	display: flex;
	justify-content: space-around;
	align-items: flex-end;
	height: 100%;

	a {
		&.active > div {
			opacity: 1;
			border-bottom: 3px solid ${({ theme }) => theme.colors.p500};
		}
	}
`

Menu.Item = styled('div')`
	height: 100%;
	padding: 10px 20px;
	cursor: pointer;
	opacity: 0.8;
	border-bottom: 3px solid transparent;
	letter-spacing: 2px;
	font-size: 14px;
`

export default Menu
