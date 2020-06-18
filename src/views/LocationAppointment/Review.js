import React from 'react'
import { format } from 'date-fns'

const Review = ({
	selectedServicesPrice,
	provider,
	selectedTime,
	selectedServiceIds,
	providerServicesById,
	location,
	customerNote,
	setCustomerNote,
}) => {
	return (
		<div className="container mx-auto px-2 pb-32">
			<p className="mb-4 mt-4 text-lg text-center">
				Please review and confirm the appointment details below.
			</p>

			<div className="flex md:flex-row flex flex-col-reverse">
				<div className="md:w-2/5 md:pr-4 mt-4 md:mt-0">

					<div className="md:hidden w-full bg-gray-300 w-full mt-4 mb-4" style={{ height: 1 }} />

					<h1 className="text-lg font-bold">Add booking notes</h1>
					<p className="text-sm text-gray-600">Include comments or requests about your booking</p>

					<textarea
						value={customerNote}
						onChange={({ target: { value } }) => setCustomerNote(value)}
						className="p-2 mt-2 border w-full"
						style={{ minHeight: 120 }}
					/>
				</div>

				<div className="md:w-3/5">
					<h1 className="md:text-2xl">{location.name}</h1>
					<p className="text-sm md:text-sm text-gray-600">{location.address}</p>
					<p className="font-black text-xl">
						{format(selectedTime, 'dddd MMMM Do')} at {format(selectedTime, 'h:mma')} with{' '}
						{provider.firstName}.
					</p>
					<div className="w-full bg-gray-300 w-full mt-4 mb-4" style={{ height: 1 }} />
					{selectedServiceIds.map((id) => {
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
			</div>
		</div>
	)
}

export default Review
