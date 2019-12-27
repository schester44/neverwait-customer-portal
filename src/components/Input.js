import React, { useRef } from 'react'

const Input = ({ value, label, className = '', inputClassName = '', ...props }) => {
	const ref = useRef(null)

	return (
		<div className={`mt-4 ${className}`} onClick={() => ref.current.focus()}>
			{label && <label className="block text-gray-700 text-lg font-bold mb-2">{label}</label>}
			<input
				ref={ref}
				value={value}
				className={`transition outline-none border border-transparent focus:bg-white focus:border-gray-300 placeholder:gray:600 rounded bg-gray-200 py-2 px-4 w-full focus:shadow appearance-none leading-nomral ${inputClassName}`}
				{...props}
			/>
		</div>
	)
}

export default Input
