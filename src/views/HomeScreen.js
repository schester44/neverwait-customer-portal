import React from "react"
import styled from "styled-components"

import EmployeeList from "../components/EmployeeList"

const Wrapper = styled("div")`
	display: flex;
	flex-direction: column;
	height: 100%;

	.header {
		padding: 0px 0 0 0;
		text-align: center;
		font-family: marguerite;

		h1 {
			padding-top: 40px;
			font-size: 40px;
			line-height: 1;
			color: rgba(242, 209, 116, 1);
		}
	}
`

export const Config = styled("div")`
	flex: 1;
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 34px;
	text-align: center;
`

const configPlaceholder = (
	<Config>
		Your account is not configured correctly to work with this app. At least one Staff account needs the 'Booking'
		setting enabled, as well as a service assigned to said user.
	</Config>
)

const HomeScreen = ({ employees }) => {
	return (
		<Wrapper>
			<div className="header">
				<h1>Lorenzo's</h1>
			</div>

			{employees.length === 0 ? configPlaceholder : <EmployeeList employees={employees} />}
		</Wrapper>
	)
}

export default HomeScreen
