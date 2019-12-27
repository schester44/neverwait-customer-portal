import React from 'react'
import { FiUser, FiCheck, FiCloudOff, FiX, FiUserX } from 'react-icons/fi'
import styled, { css } from 'styled-components'
import { format, addMinutes } from 'date-fns'
import { dateFromTimeString } from '../../helpers/date-from'
const Container = styled('div')(
	props => css`
		padding: 20px 10px;
		font-size: 20px;
		font-weight: 700;
		cursor: ${props.isWorking && props.isAcceptingCheckins ? 'cursor' : 'default'};

		.status {
			display: flex;
			justify-content: flex-end;

			&-main {
				margin-top: 8px;
			}

			&-item {
				margin-left: 4px;
				padding: 3px 6px;
				border-radius: 8px;
				background: rgba(242, 243, 244, 1);
				border: 1px solid rgba(239, 239, 239, 1);
				font-size: 10px;

				display: flex;
				align-items: center;
			}

			&-update {
				background: rgba(100, 105, 229, 1);
				color: white;
			}

			&-icon {
				margin-right: 4px;
				font-size: 16px;

				&-good {
					color: rgba(95, 192, 155, 1);
				}

				&-bad {
					color: tomato;
				}
			}
		}

		.left {
			display: flex;
			align-items: center;
		}

		.right {
			.time {
				text-align: right;
				color: rgba(100, 105, 229, 1);
			}
		}

		.info {
			display: flex;
			justify-content: space-between;
		}

		.avatar {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 32px;
			height: 32px;
			border-radius: 50%;
			background: gray;
			color: white;
			margin-right: 8px;
			overflow: hidden;

			&-photo {
				width: 32px;
				height: 32px;
				object-fit: cover;
			}
		}

		${props.isWorking && !props.isDisabled
			? css`
					cursor: pointer;
					.avatar {
						background: green;
					}

					&:hover {
						background: rgba(249, 251, 252, 1);
					}
			  `
			: css`
					cursor: not-allowed;
					opacity: 0.8;
					filter: grayscale(80%);
			  `}

		&:not(:last-of-type) {
			border-bottom: 1px solid rgba(240, 240, 240, 1);
		}

		${props.isSelected &&
			css`
				background: rgba(249, 251, 252, 1);

				.avatar {
					background: rgba(95, 192, 155, 1);
					color: white;
				}
			`}
	`
)

const ProviderItem = ({
	isDisabled,
	provider,
	isSelected,
	isAcceptingCheckins,
	isWorking,
	onSelect
}) => {
	const waitTimeExceedsShift = isWorking && !provider.isSchedulable

	const isBookable = isWorking && !waitTimeExceedsShift
	const isFullyBooked =
		!!provider?.currentShift?.acceptingCheckins &&
		!provider.isSchedulable &&
		!provider.sourcesNextShifts.acceptingCheckins

	console.log(provider)
	return (
		<Container
			isDisabled={isDisabled}
			key={provider.id}
			isSelected={isSelected}
			isWorking={isWorking}
			isAcceptingCheckins={isAcceptingCheckins}
			onClick={onSelect}
		>
			<div className="info">
				<div className="left">
					<div className="avatar">
						{isSelected ? (
							<FiCheck />
						) : isDisabled || !isBookable ? (
							<FiUserX />
						) : provider.photo ? (
							<img src={provider.photo} alt="Provider" className="avatar-photo" />
						) : (
							<FiUser />
						)}
					</div>
					<div>
						{provider.firstName} {provider.lastName && provider.lastName}
					</div>
				</div>

				<div className="right">
					{!waitTimeExceedsShift && isWorking && provider.currentShift.acceptingCheckins && (
						<div>
							<p style={{ fontSize: 10, opacity: 0.7 }}>Next Available Time</p>
							<div className="time">
								{provider.waitTime < 20
									? 'NOW'
									: format(addMinutes(new Date(), provider.waitTime + 3), 'h:mma')}
							</div>
						</div>
					)}

					{waitTimeExceedsShift && !provider.sourcesNextShifts.acceptingCheckins && (
						<div className="status">
							<div className="status-item">
								<FiCloudOff className="status-icon status-icon-bad" color="tomato" />

								<span>{isFullyBooked ? 'Fully Booked' : 'Unavailable'}</span>
							</div>
						</div>
					)}

					{waitTimeExceedsShift &&
						(provider.sourcesNextShifts.acceptingCheckins ||
							provider.sourcesNextShifts.acceptingWalkins) && (
							<div className="status" style={{ flexDirection: 'column' }}>
								{provider.sourcesNextShifts.acceptingWalkins && (
									<div className="status-item status-update">
										<span>
											Accepting Walk-ins at{' '}
											{format(
												dateFromTimeString(provider.sourcesNextShifts.acceptingWalkins.start_time),
												'h:mma'
											)}
										</span>
									</div>
								)}

								{provider.sourcesNextShifts.acceptingCheckins && (
									<div className="status-item status-update">
										<span>
											Accepting Check-ins at{' '}
											{format(
												dateFromTimeString(provider.sourcesNextShifts.acceptingCheckins.start_time),
												'h:mma'
											)}
										</span>
									</div>
								)}
							</div>
						)}

					{!isWorking && (
						<div className="status">
							<div className="status-item">
								<FiCloudOff className="status-icon status-icon-bad" color="tomato" />
								<span>Not Working</span>
							</div>
						</div>
					)}
				</div>
			</div>

			<div className="status status-main">
				<div className="status-item">
					{provider?.currentShift?.acceptingWalkins ? (
						<FiCheck className="status-icon status-icon-good" />
					) : (
						<FiX className="status-icon status-icon-bad" />
					)}
					<span>Walk-ins</span>
				</div>

				<div className="status-item">
					{provider?.currentShift?.acceptingCheckins ? (
						<FiCheck className="status-icon status-icon-good" />
					) : (
						<FiX className="status-icon status-icon-bad" />
					)}
					<span>Check-ins</span>
				</div>

				<div className="status-item">
					{provider?.currentShift?.acceptingAppointments ? (
						<FiCheck className="status-icon status-icon-good" />
					) : (
						<FiX className="status-icon status-icon-bad" />
					)}
					<span>Appointments</span>
				</div>
			</div>
		</Container>
	)
}

export default ProviderItem
