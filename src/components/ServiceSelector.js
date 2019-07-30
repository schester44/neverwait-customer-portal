import React from 'react'
import Service from './ServiceCard'

const ServiceSelector = ({ selectedService, services, onSelect }) => {
	return services.map(service => {
		return (
			<Service
				key={`service-${service.id}`}
				onClick={() => onSelect(service)}
				service={service}
				selected={selectedService === service.id}
			/>
		)
	})
}

const areEqual = (prevProps, nextProps) => prevProps.selectedService === nextProps.selectedService

export default React.memo(ServiceSelector, areEqual)
