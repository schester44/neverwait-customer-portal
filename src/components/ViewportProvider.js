import React from 'react'

export const Context = React.createContext({
	width: 0,
	height: 0,
	isMobile: false,
})

const ViewportProvider = ({ children }) => {
	// This is the exact same logic that we previously had in our hook

	const [state, setState] = React.useState({
		width: window.innerWidth,
		height: window.innerHeight,
		isMobile: window.innerWidth <= 768,
	})

	const handleWindowResize = () => {
		setState({
			width: window.innerWidth,
			height: window.innerHeight,
			isMobile: window.innerWidth <= 768,
		})
	}

	React.useEffect(() => {
		window.addEventListener('resize', handleWindowResize)
		return () => window.removeEventListener('resize', handleWindowResize)
	}, [])

	return <Context.Provider value={state}>{children}</Context.Provider>
}

export default ViewportProvider

export const useViewport = () => {
	return React.useContext(Context)
}
