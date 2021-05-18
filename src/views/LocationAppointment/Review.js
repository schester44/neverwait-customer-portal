import React from 'react'
import { format } from 'date-fns'
import { CardElement } from '@stripe/react-stripe-js'

const Review = ({
	selectedServicesPrice,
	provider,
	selectedTime,
	selectedServiceIds,
	providerServicesById,
	location,
	customerNote,
	setCustomerNote,
	onCardInfoChange,
}) => {
	return (
		<div className="container mx-auto px-2 pb-32">
			<p className="mb-4 text-sm text-center">
				Please review and confirm
				<br />
				the appointment details below.
			</p>

			<div className="md:flex-row flex flex-col-reverse">
				<div className="md:w-2/5 md:pr-4 mt-4 md:mt-0">
					<div className="md:hidden bg-gray-300 w-full mt-4 mb-4" style={{ height: 1 }} />

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
					<p className="font-black text-2xl leading-tight">
						{format(selectedTime, 'dddd MMMM Do')} at {format(selectedTime, 'h:mma')} with{' '}
						{provider.firstName}.
					</p>

					<h1 className="mt-2 text-lg font-bold md:text-2xl">{location.name}</h1>
					<p className="text-sm md:text-sm text-gray-600">{location.address}</p>

					<div className="bg-gray-300 w-full mt-4 mb-4" style={{ height: 1 }} />
					{selectedServiceIds.map((id) => {
						const service = providerServicesById[id]

						return (
							<div className="flex pl-1 pt-1 justify-between" key={service.id}>
								<div>
									<p className="font-bold text-lg">{service.name}</p>
									<p className="text-gray-600 text-sm">{service.duration}min</p>
								</div>

								<p className="font-bold text-lg">${service.price}</p>
							</div>
						)
					})}
					<div className="flex justify-between mt-4 border-t border-gray-200 pt-2">
						<p className="font-black text-sm">Total</p>
						<p className="font-black text-sm">${selectedServicesPrice}</p>
					</div>

					<div className="mt-4 md:max-w-lg">
						<div className="md:hidden bg-gray-300 w-full mt-4 mb-4" style={{ height: 1 }} />

						<div className="p-3 bg-gray-100 rounded">
							<h1 className="text-lg font-bold">Payment</h1>
							<p className="text-sm text-gray-600 mb-2">
								All transactions are secure and encrypted.
							</p>

							<CardElement
								onChange={onCardInfoChange}
								className="p-3 rounded border bg-white"
								options={{
									style: {
										base: {
											fontSize: '16px',
											color: '#424770',
											'::placeholder': {
												color: '#718096',
											},
										},
										invalid: {
											color: '#9e2146',
										},
									},
								}}
							/>

							<label className="flex items-center mt-3">
								<input type="checkbox" className="form-checkbox text-indigo-600 h-6 w-6" />
								<span className="ml-2 text-sm text-gray-700">
									Save card info for faster checkouts in the future
								</span>
							</label>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Review
