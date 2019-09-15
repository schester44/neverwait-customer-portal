import React from 'react'
import omit from 'lodash/omit'

import generateId from './utils/generateId'
import Pling from './Pling'
const noop = () => {}
const PlingContext = React.createContext({ show: noop, dismiss: noop, dismissAll: noop })

const Positions = {
	LEFT: 'calc(50% - 125px)',
	TOP: 10
}

export const PlingProvider = ({
	children,
	position = { left: Positions.LEFT, top: Positions.TOP },
	duration: globalDuration = 2500
}) => {
	const [state, setState] = React.useState({
		activeIds: {},
		active: []
	})

	const show = ({ title, message, autoClose, duration: plingDuration }) => {
		const id = generateId()
		const duration = plingDuration || globalDuration

		if (!title && !message) {
			return console.warn('a title or message is required')
		}

		setState(prev => ({
			...prev,
			activeIds: {
				...prev.activeIds,
				[id]: true
			},
			active: [
				...prev.active,
				{
					id,
					duration,
					title,
					message,
					autoClose
				}
			]
		}))
	}

	const dismiss = id => {
		if (!state.activeIds[id]) return

		setState(prev => ({
			...prev,
			activeIds: omit(prev.activeIds, [id]),
			active: prev.active.filter(pling => pling.id !== id)
		}))
	}

	const dismissAll = () => {
		setState(prev => ({ ...prev, activeIds: {}, active: [] }))
	}

	const value = { show, dismiss, dismissAll }

	return (
		<PlingContext.Provider value={value}>
			{state.active.map((pling, index) => {
				return (
					<Pling
						offset={state.active.length - 1 - index}
						key={pling.id}
						onDismiss={() => dismiss(pling.id)}
						pling={pling}
						position={position}
					/>
				)
			})}

			{children}
		</PlingContext.Provider>
	)
}

export const usePling = () => {
	const pling = React.useContext(PlingContext)
	return pling
}
