import React from 'react'
import styled from 'styled-components'
import { format } from 'date-fns'

import Button from '../../components/Button'
import FormFooter from '../../components/FormFooter'
import pling from '../../components/Pling'

const Wrapper = styled('div')`
	padding: 10px 10px 80px 10px;
	width: 100%;

	.block {
		padding-bottom: 24px;
		margin-bottom: 24px;
		border-bottom: 1px solid rgba(150, 150, 150, 0.5);

		p {
			line-height: 1.2;
		}

		&.service {
			display: flex;
			align-items: center;
			justify-content: space-between;
		}
	}
`

const Review = ({
	submitting,
	loading,
	price,
	selectedServices,
	selectedServiceIds,
	estimates,
	locationData,
	handleConfirm
}) => {
	const currentEstimates = React.useRef(estimates)

	React.useEffect(() => {
		if (!loading && !submitting && estimates !== currentEstimates.current) {
			pling({ intent: 'info', message: 'Someone checked in. Estimated service time has been adjusted.' })
		}
	}, [loading, submitting, estimates])

	return (
		<Wrapper>
			<div className="block location">
				<h3>{locationData.name}</h3>
				<h5>{locationData.address}</h5>
				<h5>{locationData.contactNumber}</h5>
			</div>

			<div className="block service">
				<div>
					{selectedServiceIds.map((id, index) => {
						return (
							<h3 key={index} style={{ marginTop: index > 0 ? 4 : 0 }}>
								{selectedServices[id].name}
							</h3>
						)
					})}
					<h5>{estimates.duration} minutes</h5>
				</div>
				<h3>${price}</h3>
			</div>

			<div className="block">
				<p>Your estimated service time is:</p>
				<h1 style={{ color: 'rgba(242, 209, 116, 1)', fontSize: 60 }}>{format(estimates.startTime, 'h:mma')}</h1>
			</div>

			<h4 style={{ opactiy: 0.5, fontWeight: 100 }}>
				The above time has not been secured and is only an estimate. Click confirm to lock in your scheduled time.
			</h4>

			<FormFooter>
				<Button disabled={loading} style={{ width: '100%' }} onClick={handleConfirm}>
					{loading ? 'Confirming...' : 'Confirm'}
				</Button>
			</FormFooter>
		</Wrapper>
	)
}

export default Review
