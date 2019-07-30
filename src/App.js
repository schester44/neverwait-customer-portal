import React from 'react'
import { withRouter, Switch, Route } from 'react-router-dom'

import Loading from './components/Loading'
import LocationCheckin from './views/LocationCheckin'

const App = () => {
	return (
		<React.Suspense fallback={<Loading />}>
			<div style={{ maxWidth: 900, margin: '0 auto' }}>
				<Switch>
					<Route
						path="/book/l/:id"
						render={props => {
							return <LocationCheckin id={props.match.params.id} match={props.match} />
						}}
					/>
				</Switch>
			</div>
		</React.Suspense>
	)
}

export default withRouter(App)
