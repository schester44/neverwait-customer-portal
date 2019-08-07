import React from 'react'
import { render } from 'react-dom'
import { ApolloProvider } from '@apollo/react-hooks'
import { BrowserRouter as Router } from 'react-router-dom'

import * as Sentry from '@sentry/browser'

import client from './graphql/createClient'
import App from './App'
import './index.css'

if (process.env.NODE_ENV === 'production') {
	Sentry.init({ dsn: process.env.REACT_APP_SENTRY_DSN })
}

render(
	<ApolloProvider client={client}>
		<Router>
			<App />
		</Router>
	</ApolloProvider>,
	document.getElementById('root')
)
