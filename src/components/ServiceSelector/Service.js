import React from 'react'
import clsx from 'clsx'
import { FiCheck } from 'react-icons/fi'

const Service = ({ isSelected, shouldShowDuration, service, onClick }) => {
	return (
		<div
			className="flex px-2 hover:bg-gray-100 py-4 items-center border-b border-gray-200 cursor-pointer"
			onClick={onClick}
		>
			<div className="flex items-center">
				<div
					className={clsx(
						'w-8 h-8 rounded-full border-2 border-gray-400 flex items-center justify-center text-white',
						{ 'border-indigo-500 bg-indigo-500': isSelected }
					)}
				>
					{isSelected && <FiCheck size={18} />}
				</div>
			</div>
			<div className="flex-1 pl-3">
				<div className="flex items-center justify-between">
					<div className="left">
						<p className="font-bold text-lg leading-none">{service.name}</p>
						<p className="text-gray-600 text-sm">
							{/* TODO: Convert to human readable, should something exceed 1 hour (salons) */}
							{shouldShowDuration && `${service.duration} min`}
							{service.description && shouldShowDuration && ' - '}
							{service.description}
						</p>
					</div>
					<p className="font-bold text-lg">${service.price}</p>
				</div>
			</div>
		</div>
	)
}

export default Service
