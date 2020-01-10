import React from 'react'
import { render } from 'react-dom'
import { ApolloProvider } from '@apollo/react-hooks'
import { BrowserRouter as Router } from 'react-router-dom'

import client from './apollo-client'
import App from './App'

import './styles/tailwind.css'

import ReactGA from 'react-ga'

import * as Sentry from '@sentry/browser'

ReactGA.initialize(process.env.REACT_APP_GATRACKINGID, {
	debug: process.env.NODE_ENV !== 'production'
})

if (process.env.NODE_ENV === 'production' && window.SENTRY_RELEASE) {
	console.log('Sentry initialized', `portal-${window.SENTRY_RELEASE.id}`)
	Sentry.init({
		environment: process.env.NODE_ENV,
		dsn: process.env.REACT_APP_SENTRY_DSN,
		release: `portal-${window.SENTRY_RELEASE.id}`
	})
}

render(
	<ApolloProvider client={client}>
		<Router>
			<App />
		</Router>
	</ApolloProvider>,
	document.getElementById('root')
)

// This fires when a user is prompted to add the app to their homescreen
// We use it to track it happening in Google Analytics so we have those sweet metrics

window.addEventListener('beforeinstallprompt', e => {
	ReactGA.event({
		category: 'AppInstall',
		action: 'Prompted',
		label: 'HomeScreen'
	})

	e.userChoice.then(choiceResult => {
		if (choiceResult.outcome === 'dismissed') {
			ReactGA.event({
				category: 'AppInstall',
				action: 'Dismissed',
				label: 'HomeScreen'
			})
		} else {
			ReactGA.event({
				category: 'AppInstall',
				action: 'Added',
				label: 'HomeScreen'
			})
		}
	})
})
