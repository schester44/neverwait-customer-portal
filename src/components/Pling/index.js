import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import Pling from './Pling'

export { PlingProvider, usePling } from './context'

export default ({ title, message, duration = 2500 }) => {
	const div = document.createElement('div')
	document.body.appendChild(div)

	const onDismiss = () => {
		unmountComponentAtNode(div)
		div.parentNode.removeChild(div)
	}

	render(
		<Pling
			onDismiss={onDismiss}
			pling={{
				id: 'MY_ID',
				title,
				message,
				duration
			}}
		/>,
		div
	)
}
