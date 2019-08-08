const white = '#FFFFFF'
const black = '#0F131A'

const neutrals = {
	n100: 'rgba(26, 30, 32, 1)',
	n200: 'rgba(45, 50, 53, 1)',
	n500: 'rgba(242, 242, 242, 1)',
	n700: white
}

const primary = {
	p500: 'rgba(237, 209, 129, 1.0)'
}

const greens = {
	g500: 'rgba(101, 211, 110, 1)'
}

const misc = {
	shadow: 'rgba(26, 30, 32, 0.05)',
	bodyBg: neutrals.n500,
	bodyColor: neutrals.n100,
	success: greens.g500,
	headerBg: white,
	headerColor: neutrals.n100
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
	default: '-apple-system, Lato, sans-serif',
	lafx: 'marguerite, Lato, sans-serif'
}
