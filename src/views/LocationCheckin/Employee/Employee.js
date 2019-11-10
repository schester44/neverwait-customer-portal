import React from 'react'

import Container from './Container'

const Employee = ({ employee, onClick }) => {
	return (
		<Container onClick={onClick}>
			<div className="main">
				<div>
					<h1>{employee.firstName}</h1>
				</div>

				<div className="right">
					<button>
						<span>SELECT</span>
					</button>
				</div>
			</div>
		</Container>
	)
}

export default Employee
