import React from 'react'
import Service from './ServiceCard'
import FormFooter from './FormFooter'
import Button from './Button'

const ServiceSelector = ({ selectedService, services, onSelect, onNext }) => {
	return (
		<div style={{ width: '100%', marginBottom: 100 }}>
			{services.map(service => {
				return (
					<Service
						key={`service-${service.id}`}
						onClick={() => onSelect(service)}
						service={service}
						selected={selectedService === service.id}
					/>
				)
			})}

			{selectedService && (
				<FormFooter>
					<span>{selectedService ? '1 service selected' : 'No services selected'}</span>
					<Button onClick={onNext} style={{ width: '50%' }}>
						Book Now
					</Button>
				</FormFooter>
			)}
		</div>
	)
}

const areEqual = (prevProps, nextProps) => prevProps.selectedService === nextProps.selectedService

export default React.memo(ServiceSelector, areEqual)
