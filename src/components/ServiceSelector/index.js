import React from 'react'
import Service from './Service'

const ServiceSelector = ({ services = [], selected = {}, shouldShowDuration, onSelect }) => {
	return (
		<div>
			{services.map((service) => {
				return (
					<Service
						key={service.id}
						shouldShowDuration={shouldShowDuration}
						isSelected={selected.includes(service.id)}
						service={service}
						onClick={() => onSelect(service)}
					/>
				)
			})}
		</div>
	)
}

export default ServiceSelector
