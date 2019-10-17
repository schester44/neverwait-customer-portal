import React from 'react'
import Service from './ServiceCard'
import FormFooter from './FormFooter'
import Button from './Button'

const ServiceSelector = ({ price, selectedServiceIds = [], selectedServices = {}, services, onSelect, onNext }) => {
	const totalSelected = selectedServiceIds.length

	return (
		<div style={{ width: '100%', paddingBottom: 100, overflow: 'auto' }}>
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
						<span>
							{totalSelected > 0
								? `${totalSelected} ${totalSelected === 1 ? 'service' : 'services'} selected`
								: 'No services selected'}
						</span>
						<p className="price">${price}</p>
					</div>
					<Button onClick={onNext} style={{ width: '50%' }}>
						Book Now
					</Button>
				</FormFooter>
			)}
		</div>
	)
}

const areEqual = (prevProps, nextProps) => prevProps.selectedServiceIds === nextProps.selectedServiceIds

export default React.memo(ServiceSelector, areEqual)
