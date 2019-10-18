import React from 'react'
import styled from 'styled-components'
import Button from '../../components/Button'
import { lighten } from 'polished'

const Container = styled('div')`
	text-align: center;
	width: 100%;
	height: 100%;
	padding-bottom: 40px;
	display: flex;
	flex-direction: column;

	.title {
		margin-top: 24px;
		margin-bottom: 7px;
	}

	.highlight {
		position: relative;

		.text-to-highlight {
			position: absolute;
			top: -5px;
			right: 10px;
			background: ${({ theme }) => theme.colors.brandSecondary};
			padding: 4px 10px;
			border-radius: 25px;
			color: white;
			font-size: 10px;
			font-weight: 700;
		}
	}

	.actions {
		width: 80%;
		margin: 24px auto 0 auto;

		.separator {
			width: 100%;
			text-align: center;
			position: relative;
			margin: 24px 5px;
			color: ${({ theme }) => lighten(0.2, theme.colors.brand)};

			& > div {
				&:before {
					left: 0;
					top: 10px;
					position: absolute;
					content: ' ';
					width: calc(50% - 15px);
					height: 1px;
					background: ${({ theme }) => lighten(0.5, theme.colors.brand)};
				}

				&:after {
					right: 5px;
					top: 10px;
					position: absolute;
					content: ' ';
					width: calc(50% - 20px);
					height: 1px;
					background: ${({ theme }) => lighten(0.5, theme.colors.brand)};
				}
			}
		}
	}
`

const SourceTypeSelection = ({ onSelectCheckin, onSelectAppointment }) => {
	return (
		<Container>
			<h2 className="title">Choose service time </h2>
			<p className="small-sub-text">Need it soon or need it when you need it?</p>

			<div className="actions">
				{/* Show, but disable this button if we can't book the employee (due to schedule reasons) */}
				<Button onClick={onSelectCheckin} style={{ width: '100%' }}>
					First Available Time Today
				</Button>

				<div className="separator">
					<div>or</div>
				</div>

				<div className="highlight">
					<div className="text-to-highlight">NEW!</div>
					<Button onClick={onSelectAppointment} style={{ width: '100%' }}>
						Create Appointment
					</Button>
				</div>
			</div>
		</Container>
	)
}

export default SourceTypeSelection
