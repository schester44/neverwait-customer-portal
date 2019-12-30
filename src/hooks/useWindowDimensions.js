import React from 'react'

const useWindowDimensions = () => {
	const [state, setState] = React.useState({ width: window.innerWidth, height: window.innerHeight })

	React.useEffect(() => {
		var resizeTimeout

		const listener = () => {
			window.clearTimeout(resizeTimeout)

			resizeTimeout = window.setTimeout(() => {
				setState({
					width: window.innerWidth,
					height: window.innerHeight
				})
			}, 100)
		}

		window.addEventListener('resize', listener)

		return () => {
			window.removeEventListener('resize', listener)
		}
	}, [])

	return state
}

export default useWindowDimensions
