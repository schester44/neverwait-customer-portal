import React from 'react'
import Button from '../../../components/Button'
import { FiArrowLeft } from 'react-icons/fi'

const NoWaitModal = ({ location, onClose }) => {
	return (
		<div
			style={{
				position: 'fixed',
				top: 0,
				left: 0,
				width: '100%',
				height: '100vh',
				zIndex: 999,
				background: 'rgba(245, 247, 251, 1.0)',
				lineHeight: 1.5,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'space-between',
				paddingTop: 40,
				paddingBottom: 40
			}}
		>
			<div>
				<h1 style={{ lineHeight: 1, margin: '0 auto', textAlign: 'center', maxWidth: '80%' }}>Great News!</h1>

				<p style={{ opacity: 0.8, lineHeight: 1.5, margin: '25px auto', textAlign: 'center', maxWidth: '80%' }}>
					This staff member's line isn't long enough to check in, you can just show up!
				</p>

				<p
					style={{
						opacity: 0.7,
						fontSize: 14,
						lineHeight: 1.5,
						margin: '25px auto 40px auto',
						textAlign: 'center',
						maxWidth: '90%'
					}}
				>
					Act fast though because the wait time can change by the time you get to {location.name}. There's no guarantee
					that there won't be a line by the time you get there.
				</p>
			</div>

			<Button
				onClick={onClose}
				style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '95%', margin: '0 auto' }}
			>
				<FiArrowLeft style={{ marginRight: 4 }} /> Go Back
			</Button>
		</div>
	)
}

export default NoWaitModal
