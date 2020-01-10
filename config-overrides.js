const path = require('path')
const { override, addBabelPlugins, addBundleVisualizer } = require('customize-cra')
const SentryCliPlugin = require('@sentry/webpack-plugin')

console.log('NETLIFY', process.env.NETLIFY)
console.log('COMMIT_REF', process.env.COMMIT_REF)

function addSentry(config) {
	// Only run if on netlify
	if (!process.env.NETLIFY) return config

	config.plugins.push(
		new SentryCliPlugin({
			release: process.env.COMMIT_REF,
			urlPrefix: '~/static/js',
			include: path.resolve(__dirname, 'src'),
			ignore: ['node_modules'],
			debug: true,
			configFile: path.resolve(__dirname, '.sentry.properties')
		})
	)

	return config
}

module.exports = override(
	addSentry,
	process.env.ANALYZE_BUNDLE && addBundleVisualizer(),
	addBabelPlugins('@babel/plugin-proposal-optional-chaining', 'date-fns')
)
