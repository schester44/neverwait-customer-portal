import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { onError } from 'apollo-link-error'
import qs from 'query-string'
import { HttpLink } from 'apollo-link-http'
import { WebSocketLink } from 'apollo-link-ws'
import { ApolloLink, split } from 'apollo-link'
import { getMainDefinition } from 'apollo-utilities'

import pling from './components/Pling'
import { SubscriptionClient } from 'subscriptions-transport-ws'

function getImpt() {
	let { impt } = qs.parse(window.location.search)

	if (impt) {
		window.sessionStorage.impt = impt

		return impt
	}

	return window.sessionStorage.impt
}

export const impt = getImpt()

const onErrorLink = onError(({ graphQLErrors = [] }) => {
	if (graphQLErrors.length > 0) {
		for (let error of graphQLErrors) {
			pling({ message: error.message })
		}
	}
})

const subClient = new SubscriptionClient(process.env.REACT_APP_SUBSCRIPTION_URI, {
	credentials: 'include',
	reconnect: true,
	lazy: true,
})

subClient.on('connected', () => console.log('socket connected'))
subClient.on('disconnected', () => console.log('socket disconnected'))
subClient.on('reconnecting', () => console.log('socket reconnecting'))
subClient.on('reconnected', () => console.log('socket reconnected'))

export const wsLink = new WebSocketLink(subClient)

let headers = {}

if (impt) {
	headers['X-NWPROFILEIMPT'] = impt
}

export const httpLink = ApolloLink.from([
	onErrorLink,
	new HttpLink({
		credentials: 'include',
		uri: process.env.REACT_APP_API_URL,
		headers,
	}),
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
const client = new ApolloClient({ link, cache })

export default client
