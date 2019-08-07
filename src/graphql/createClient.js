import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { onError } from 'apollo-link-error'

import { HttpLink } from 'apollo-link-http'
import { WebSocketLink } from 'apollo-link-ws'
import { ApolloLink, split } from 'apollo-link'
import { getMainDefinition } from 'apollo-utilities'
import { setContext } from 'apollo-link-context'
import { matchPath } from 'react-router-dom'

import pling from '../components/Pling'
const debug = require('debug')('app:graphql')

const onErrorLink = onError(({ graphQLErrors = [], networkError }) => {
	graphQLErrors.forEach(error => {
		pling({ message: error.message })
	})

	if (networkError) {
		console.log(networkError)
		pling({ message: 'The app is having trouble connecting. Please try again later.' })
	}

	debug({ graphQLErrors, networkError })
})

const baseLink = setContext(() => {
	return {
		headers: {
			// Let the backend know that this request comes from us. really shitty, bypassable way to let the API know that the requester at least is aware of the requirements to make the request.
			'X-ici': true
		}
	}
})

export const wsLink = new WebSocketLink({
	uri: process.env.REACT_APP_SUBSCRIPTION_URI,
	options: {
		reconnect: true,
		lazy: true,
		connectionParams: {
			// Let the backend know that this request comes from us. really shitty, bypassable way to let the API know that the requester at least is aware of the requirements to make the request.
			'X-ici': true
		}
	}
})

export const httpLink = ApolloLink.from([
	onErrorLink,
	new HttpLink({
		credentials: 'include',
		uri: process.env.REACT_APP_API_URL
	})
])

const link = split(
	({ query }) => {
		const { kind, operation } = getMainDefinition(query)
		return kind === 'OperationDefinition' && operation === 'subscription'
	},
	wsLink,
	httpLink
)

const cache = new InMemoryCache()
const client = new ApolloClient({ link: baseLink.concat(link), cache })

export default client
