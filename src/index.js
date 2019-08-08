import React from 'react'
import { render } from 'react-dom'
import { ApolloProvider } from '@apollo/react-hooks'
import { BrowserRouter as Router } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import * as Sentry from '@sentry/browser'

import client from './graphql/createClient'
import App from './App'

import { light as theme } from './themes'
import { createStyles } from './themes/global-styles'

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
