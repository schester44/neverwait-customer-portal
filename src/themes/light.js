const white = '#FFFFFF'
const black = '#0F131A'

const neutrals = {
	n100: 'rgba(26, 30, 32, 1)',
	n500: 'rgba(242, 242, 242, 1)',
	n700: white
}

const greens = {
	g500: 'rgba(101, 211, 110, 1)'
}

const misc = {
	shadow: '#0C0F14',
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
	text: {
		small: {
			fontSize: '10px',
			lineHeight: 1
		}
	}
}

export const colors = {
	white,
	black,
	...neutrals,
	...greens,
	...misc
}

export const fontStack = {
	default: '-apple-system, Lato, sans-serif',
	lafx: 'marguerite, Lato, sans-serif'
}
