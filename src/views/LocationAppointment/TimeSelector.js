import React from 'react'
import clsx from 'clsx'
import { format } from 'date-fns'

const TimeSelector = ({ slots, value, onSelect }) => {
	return (
		<div className="w-full flex scrolling-touch overflow-x-auto flex-wrap">
			{slots.length === 0 && (
				<div className="flex items-center w-full items-center">
					<p className="text-center">
						No time slots available on selected day.
						<br />
						Try selecting another day.
					</p>
				</div>
			)}

			{slots.map((slot, idx) => {
				const isSelected = slot.start_time === value

				return (
					<div
						onClick={() => onSelect(slot.start_time)}
						key={`slot-${idx}`}
						style={{ margin: '2.5px', width: `calc(50% - 5px)` }}
						className={clsx(
							'hover:bg-gray-100 font-bold flex items-center justify-center px-2 py-3 border border-gray-300 cursor-pointer rounded text-lg',
							{
								'bg-gray-100 border-indigo-500 text-indigo-500 shadow': isSelected
							}
						)}
					>
						{format(slot.start_time, 'h:mma')}
					</div>
				)
			})}
		</div>
	)
}

export default TimeSelector
