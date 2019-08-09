import React from 'react'
import styled from 'styled-components'

const Container = styled('div')`
	width: 100%;
`

const MenuItem = styled('div')`
	padding: 8px;
	border-top: 1px solid ${({ theme }) => theme.colors.n700};
    cursor: pointer;
`

const Menu = ({ children }) => {
	return <Container>{children}</Container>
}

Menu.Item = MenuItem

export default Menu
