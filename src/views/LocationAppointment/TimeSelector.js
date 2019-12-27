import React from 'react'
import clsx from 'clsx'
import { format, isEqual } from 'date-fns'

const TimeSelector = ({ slots, value, onSelect }) => {
	return (
		<div className="w-full flex scrolling-touch overflow-x-auto flex-wrap">
			{slots.length === 0 && (
				<p className="text-center text-lg mt-8 text-gray-900 w-full">
					No time slots available on selected day.
					<br />
					Try selecting another day.
				</p>
			)}

			{slots.map((slot, idx) => {
				const isSelected = value && isEqual(slot.start_time, value)

				return (
					<div key={`slot-${idx}`} className="w-1/3 p-1">
						<div
							onClick={() => onSelect(slot.start_time)}
							className={clsx(
								'hover:bg-gray-100 w-full font-bold flex items-center justify-center px-2 py-3 border border-gray-300 cursor-pointer rounded text-lg',
								{
									'bg-gray-100 border-indigo-500 text-indigo-500 shadow': isSelected
								}
							)}
						>
							{format(slot.start_time, 'h:mma')}
						</div>
					</div>
				)
			})}
		</div>
	)
}

export default TimeSelector
