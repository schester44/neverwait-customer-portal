import React from 'react'
import { format, addMinutes } from 'date-fns'

const Review = ({ selectedServicesPrice, provider, services, location }) => {
	return (
		<div className="container mx-auto px-2">
			<p className="mb-3 leading-snug px-2 pt-2 text-lg">
				Please review and confirm you'd like to check-in with {provider.firstName}{' '}
				<span className="font-black text-red-500">
					today at {format(addMinutes(new Date(), provider.waitTime + 3), 'h:mma')}.
				</span>
			</p>

			<h3 className="font-black text-lg">{location.name}</h3>
			<p className="text-sm text-gray-600 leading-snug">{location.address}</p>
			<p className="text-sm text-gray-600 leading-snug">{location.phoneNumber}</p>

			<div className="h-px w-full bg-gray-200 my-2" />

			<h3 className="mb-2 text-lg font-bold">Service Details</h3>

			{services.map(service => {
				return (
					<div className="flex pl-1 pt-1 justify-between" key={service.id}>
						<div>
							<p className="text-sm font-bold">{service.name}</p>
							<p className="text-sm text-gray-600 leading-snug">{service.duration}min</p>
						</div>
						<p className="text-sm font-bold">${service.price}</p>
					</div>
				)
			})}

			<div className="flex justify-between mt-3 border-t border-gray-200 pt-2">
				<p className="font-black">Total</p>
				<p className="font-black">${selectedServicesPrice}</p>
			</div>

			<p className="text-center mt-4 text-sm text-gray-600 leading-snug" style={{ paddingBottom: 100 }}>
				The above time has not been secured and is only an estimate. Click Confirm to lock in your
				scheduled time.
			</p>
		</div>
	)
}

export default Review
