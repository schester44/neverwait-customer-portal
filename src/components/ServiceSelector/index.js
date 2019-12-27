import React from 'react'
import Service from './Service'

const ServiceSelector = ({ services = [], selected = {}, onSelect }) => {
	return (
		<div>
			{services.map(service => {
				return (
					<Service
						key={service.id}
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
