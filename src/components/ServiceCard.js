import React from 'react'
import styled, { css } from 'styled-components'

const themeStyles = ({ theme }) => css`
	background: white;
	color: ${theme.colors.bodyColor};

	&:before {
		border: 2px solid ${theme.colors.brand};
	}
`

const selectedStyles = ({ selected, theme }) =>
	selected
		? css`
				cursor: default;

				&:after {
					position: absolute;
					width: 16px;
					height: 16px;
					border-radius: 50%;
					background: ${theme.colors.brand};
					z-index: 99;
					top: calc(50% - 6px);
					left: 23px;
					content: '';
				}
		  `
		: css`
				&:hover {
					border: 1px solid ${theme.colors.brand};
					box-shadow: 0px 2px 5px rgba(32, 32, 32, 0.1);
				}
		  `

const Container = styled('div')`
	position: relative;
	margin-top: 10px;
	color: white;
	box-shadow: 0px 1px 3px rgba(32, 32, 32, 0.05);
	padding: 20px;
	border-radius: 5px;
	border: 1px solid transparent;
	width: 100%;
	padding-left: 60px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	cursor: pointer;

	&:before {
		position: absolute;
		width: 22px;
		height: 22px;
		border-radius: 50%;
		z-index: 99;
		top: calc(50% - 11px);
		left: 18px;
		content: '';
	}

	h2 {
		line-height: 1;
		font-family: inherit;
	}

	.price {
		font-size: 14px;
		opacity: 0.5;
		font-weight: 700;
		text-transform: uppercase;
	}

	p {
		font-size: 12px;
		opacity: 0.5;
		font-weight: 700;
		text-transform: uppercase;
	}

	${themeStyles};
	${selectedStyles};
`

const ServiceCard = ({ selected, service, onClick }) => {
	return (
		<Container selected={selected} onClick={onClick}>
			<div>
				<h2>{service.name}</h2>
				<p>{service.sources.length > 0 && <span>{service.sources[0].duration} minutes</span>}</p>
			</div>

			<div className="price">{service.sources.length > 0 && `$${service.sources[0].price}`}</div>
		</Container>
	)
}

export default ServiceCard
