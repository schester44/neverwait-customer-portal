import React from 'react'
import { FiScissors } from 'react-icons/fi'

const MaintenanceMode = () => {
	return (
		<div
			style={{
				width: '100vw',
				height: '90vh',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				flexDirection: 'column'
			}}
		>
			<FiScissors fontSize="92px" style={{ marginBottom: 24 }} />
			<h2>Good things are on the way</h2>
			<p className="small-sub-text" style={{ textAlign: 'center', marginTop: 14 }}>
				Our app is undergoing maintenance right now.
				<br />
				Please come back later. Thank you for your patience.
			</p>
		</div>
	)
}

export default MaintenanceMode
