import React from 'react'
import styled from 'styled-components'

import Service from './Service'

const Container = styled('div')``

const ServiceSelector = ({ services = [], selected = {}, onSelect }) => {
	return (
		<Container>
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
		</Container>
	)
}

export default ServiceSelector
