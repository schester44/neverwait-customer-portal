import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import { useLocation } from 'react-router-dom'
import ReactGA from 'react-ga'

import AddToHomeScreen from './components/AddToHomeScreen'
import MaintenanceMode from './views/MaintenanceMode'
import LoadingScreen from './views/LoadingScreen'

import { profileQuery } from './graphql/queries'

import AuthenticatedRoutes from './AuthenticatedRoutes'
import GuestRoutes from './GuestRoutes'

const App = () => {
	const location = useLocation()

	React.useEffect(() => {
		ReactGA.pageview(location.pathname)
	}, [location.pathname])

	const { data, loading } = useQuery(profileQuery, {
		skip: !localStorage.getItem('nw-portal-sess')
	})

	const profile = data?.profile

	React.useEffect(() => {
		if (!profile) return

		ReactGA.set({ userId: profile.id })
	}, [profile])

	if (loading) return <LoadingScreen />

	if (process.env.REACT_APP_MAINTENANCE_MODE) {
		return (
			<React.Suspense fallback={<LoadingScreen />}>
				<MaintenanceMode />
			</React.Suspense>
		)
	}

	return (
		<React.Suspense fallback={<LoadingScreen />}>
			<div className="container mx-auto h-full">
				<AddToHomeScreen />

				{profile ? <AuthenticatedRoutes profile={profile} /> : <GuestRoutes />}
			</div>
		</React.Suspense>
	)
}

export default App
