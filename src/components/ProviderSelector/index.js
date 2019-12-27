import React from 'react'
import styled from 'styled-components'

import Provider from './Provider'

const Container = styled('div')``

const ProviderSelector = ({
	isAppointmentSelector = false,
	selected,
	providers = [],
	onSelect
}) => {
	return (
		<Container>
			{providers.map(provider => {
				return (
					<Provider
						key={provider.id}
						isAppointmentSelector={isAppointmentSelector}
						provider={provider}
						isSelected={parseInt(provider.id, 10) === parseInt(selected, 10)}
						onClick={() => onSelect(provider)}
					/>
				)
			})}
		</Container>
	)
}

export default ProviderSelector
