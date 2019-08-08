import * as Sentry from '@sentry/browser'

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

export const logError = error => Sentry.captureEvent(error)