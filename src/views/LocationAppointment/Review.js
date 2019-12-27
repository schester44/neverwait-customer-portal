import React from 'react'
import { format } from 'date-fns'

const Review = ({
	selectedServicesPrice,
	provider,
	selectedTime,
	selectedServiceIds,
	providerServicesById,
	location
}) => {
	return (
		<div className="container mx-auto px-2">
			<p className="mb-6 mt-4 text-lg">
				Please review and confirm you'd like to make an appointment with {provider.firstName}{' '}
				<span className="font-black text-red-500">
					{format(selectedTime, 'dddd MMM Do')} at {format(selectedTime, 'h:mma')}.
				</span>
			</p>

			<h3 className="font-black text-lg">{location.name}</h3>
			<p className="text-sm text-gray-600">{location.address}</p>
			<p className="text-sm text-gray-600">{location.phoneNumber}</p>

			<div className="h-px w-full bg-gray-200 my-2" />

			<h3 className="mt-3 text-xl font-bold">Service Details</h3>

			{selectedServiceIds.map(id => {
				const service = providerServicesById[id]

				return (
					<div className="flex pl-1 pt-1 justify-between" key={service.id}>
						<div>
							<p className="font-bold text-lg">{service.name}</p>
							<p className="text-gray-600 text-lg">{service.duration}min</p>
						</div>
						<p className="font-bold text-lg">${service.price}</p>
					</div>
				)
			})}

			<div className="flex justify-between mt-3 border-t border-gray-200 pt-2">
				<p className="font-black">Total</p>
				<p className="font-black">${selectedServicesPrice}</p>
			</div>
		</div>
	)
}

export default Review
