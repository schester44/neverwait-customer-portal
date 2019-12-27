const { override, addBabelPlugins, addBundleVisualizer } = require('customize-cra')

module.exports = override(
	process.env.ANALYZE_BUNDLE && addBundleVisualizer(),
	addBabelPlugins('@babel/plugin-proposal-optional-chaining', 'date-fns')
)
