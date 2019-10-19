import React from 'react'
import Service from './ServiceCard'
import FormFooter from './FormFooter'
import Button from './Button'

const ServiceSelector = ({ price, selectedServiceIds = [], selectedServices = {}, services, onSelect, onNext }) => {
	const totalSelected = selectedServiceIds.length

	return (
		<div style={{ width: '100%', paddingBottom: 100, overflow: 'auto', padding: "0 10px" }}>
			{services.map(service => {
				return (
					<Service
						key={`service-${service.id}`}
						onClick={() => onSelect(service)}
						service={service}
						selected={!!selectedServices[service.id]}
					/>
				)
			})}

			{totalSelected > 0 && (
				<FormFooter>
					<div>
						<p className="small-sub-text">
							{totalSelected > 0
								? `${totalSelected} ${totalSelected === 1 ? 'service' : 'services'} selected`
								: 'No services selected'}
						</p>
						<p className="price">${price}</p>
					</div>
					<Button onClick={onNext} style={{ width: '50%' }}>
						Continue
					</Button>
				</FormFooter>
			)}
		</div>
	)
}

const areEqual = (prevProps, nextProps) => prevProps.selectedServiceIds === nextProps.selectedServiceIds

export default React.memo(ServiceSelector, areEqual)
