const white = '#FFFFFF'
const black = '#121927'

const neutrals = {
	n100: black,
	n200: 'rgba(45, 50, 53, 1)',
	n450: 'rgba(150, 157, 161, 1.0)',
	n500: 'rgba(242, 242, 242, 1)',
	n700: white
}

const primary = {
	p500: '#4C50AA'
}

const greens = {
	g500: 'rgba(95, 192, 155, 1.0)'
}

export const elements = {
	card: {
		background: neutrals.n700
	},
	input: {
		background: white,
		text: neutrals.n100
	},
	button: {
		text: white,
		background: primary.p500
	}
}

const misc = {
	brandSecondary: 'rgba(236, 90, 87, 1.0)',
	brand: primary.p500,
	shadow: neutrals.n500,
	bodyBg: 'rgba(248, 249, 249, 1.0)',
	bodyColor: neutrals.n100,
	success: greens.g500,
	headerBg: white,
	headerColor: neutrals.n100,
	secondaryHeaderBg: neutrals.n700
}

export const borderRadius = {
	small: '4px',
	medium: '10px',
	large: '25px'
}

export const typography = {
	heading: {
		// TODO:
		small: {},
		medium: {},
		large: {}
	},
	subHeading: {
		small: {},
		medium: {},
		large: {}
	},
	text: {
		small: {
			fontSize: '10px',
			lineHeight: 1
		},
		medium: {
			fontSize: '16px',
			lineHeight: 1
		}
	}
}

export const colors = {
	white,
	black,
	...neutrals,
	...greens,
	...primary,
	...misc
}

export const fontStack = {
	default: 'Muli,-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif'
}
