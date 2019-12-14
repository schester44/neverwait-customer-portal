import React from 'react'
import { render } from 'react-dom'
import { ApolloProvider } from '@apollo/react-hooks'
import { BrowserRouter as Router } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'

import client from './apollo-client'
import App from './App'

import { light as theme } from './themes'
import { createStyles } from './themes/global-styles'

import ReactGA from 'react-ga'

import * as Sentry from '@sentry/browser'

ReactGA.initialize(process.env.REACT_APP_GATRACKINGID, { debug: process.env.NODE_ENV !== 'production' })

if (process.env.NODE_ENV === 'production') {
	Sentry.init({
		environment: process.env.NODE_ENV,
		dsn: process.env.REACT_APP_SENTRY_DSN,
		integrations(integrations) {
			if (process.env.NODE_ENV !== 'production') {
				return integrations.filter(integration => integration.name !== 'Breadcrumbs')
			}

			return integrations
		}
	})
}

const GlobalStyles = createStyles({ theme })

render(
	<ApolloProvider client={client}>
		<ThemeProvider theme={theme}>
			<Router>
				<GlobalStyles />
				<App />
			</Router>
		</ThemeProvider>
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
