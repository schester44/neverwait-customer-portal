import React from 'react'

import Provider from './Provider'


const ProviderSelector = ({
	isAppointmentSelector = false,
	selected,
	providers = [],
	onSelect
}) => {
	return (
		<div>
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
		</div>
	)
}

export default ProviderSelector
