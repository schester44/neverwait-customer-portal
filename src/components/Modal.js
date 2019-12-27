import React from 'react'

const Modal = ({ children, onClose }) => {
	React.useEffect(() => {
		document.querySelector('body').style.overflow = 'hidden'

		return () => {
			document.querySelector('body').style.overflow = 'inherit'
		}
	}, [])
	return (
		<div className="fixed top-0 p-2 pb-24 left-0 w-screen h-screen flex items-center justify-center">
			<div onClick={onClose} className="bg-gray-900 opacity-75 w-full h-full absolute" />

			<div style={{ maxWidth: 500 }} className="relative z-50 p-4 rounded shadow-lg bg-white">
				{children}
			</div>
		</div>
	)
}

export default Modal
