const createTypeHelper = (type, name) => ({ theme }) => {
	const { fontSize, lineHeight } = theme.typography[type][name]
	return `
    font-size: ${fontSize};
    line-height: ${lineHeight};
  `
}

export const textSmall = createTypeHelper("text", "small")
export const textMedium = createTypeHelper("text", "medium")
export const textLarge = createTypeHelper("text", "large")