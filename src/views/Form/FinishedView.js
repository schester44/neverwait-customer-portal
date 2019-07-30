import React from 'react'
import { Link, Redirect } from 'react-router-dom'
import styled from 'styled-components'
import { format, subMinutes } from 'date-fns'
import { FiCheck } from 'react-icons/fi'
import Button from '../../components/Button'

const Content = styled('div')`
	padding: 0 10px;

	position: relative;
	width: 100%;
	flex: 1;
	display: flex;
	flex-direction: column;
	text-align: center;

	.body {
		padding-top: 50px;
	}

	h1,
	h2,
	h3,
	h4 {
		line-height: 1.5;
	}

	h1 {
		margin-bottom: 50px;
		font-size: 26px;
	}

	h3 {
		font-size: 18px;
	}
`

const Finished = ({ appointment }) => {
	return (
		<Content>
			<div className="body">
				<h1 style={{ textAlign: 'center' }}>
					Checked In <FiCheck />
				</h1>

				<h3 style={{ fontSize: 16 }}>You can expect to be in the chair around:</h3>

				<h1 style={{ color: 'rgba(242, 209, 116, 1)', fontSize: 60 }}>{format(appointment.startTime, 'h:mma')}</h1>

				<h4 style={{ opactiy: 0.5, fontWeight: 100 }}>
					Please arrive 15 minutes early ({format(subMinutes(appointment.startTime, 15), 'h:mma')}).
					<br />
					To cancel, please call 724-565-5344.
				</h4>
			</div>

			<Link to="/">
				<Button className="finished-btn">Finish</Button>
			</Link>
		</Content>
	)
}

export default Finished
