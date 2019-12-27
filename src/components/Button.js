import React from 'react'
import clsx from 'clsx'

const types = {
	ghost: 'btn-ghost',
	primary: 'btn-primary',
	disabled: 'btn-disabled',
	secondary: 'btn-secondary'
}

const Button = ({ type = 'primary', children, className, disabled, ...props }) => {
	return (
		<div
			className={clsx('btn',
				className,
				types[type] || types.primary, { 'btn-disabled': disabled })}				
			{...props}
		>
			{children}
		</div>
	)
}

export default Button
