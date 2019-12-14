import React from 'react'
import styled, { css, keyframes } from 'styled-components'
import SchedulerCreator from '../../../helpers/ScheduleCreator'
import { isSameDay, format } from 'date-fns'

import DateCell from './DateCell'

const slideDown = keyframes`
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0px);
    }
`

const expand = keyframes`
    from {
        height: 58px;
    }
    to {
        height: 120px;
    }
`

const noexpand = keyframes`
 from {
        height: 120px;
    }
    to {
        height: 58px;
    }
`
const desktopStyles = ({ isDesktop }) =>
	isDesktop &&
	css`
		flex: 1;
		margin: 0 auto;
		height: 250px;

		.dates {
			height: 250px;
			align-items: flex-start;
		}

		.cells {
			flex-wrap: wrap;
			align-items: flex-start;
			justify-content: flex-start;
		}
	`

const Wrapper = styled('div')(
	props => css`
		background: white;
		border-radius: 8px;
		box-shadow: 1px 1px 2px rgba(32, 32, 32, 0.1), 0px 1px 5px rgba(32, 32, 32, 0.05);
		-webkit-appearance: none;

		.title {
			position: relative;
			font-size: 20px;
			font-weight: 700;
			padding: 10px 0;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 15px 15px 0px 15px;

			.title-date .placeholder {
				opacity: 0.5;
			}

			.caret {
				position: absolute;
				top: 18px;
				right: 20px;
				opacity: 0.5;
			}
		}

		.dates {
			width: 100%;
			height: 75px;
			display: flex;
			align-items: center;
			padding-top: 5px;
			animation: ${slideDown} 0.2s ease forwards;
		}

		.cells {
			width: 100%;
			display: flex;
			/* Make this scrollable when needed */
			overflow-x: auto;
			/* We don't want vertical scrolling */
			overflow-y: hidden;
			/* Make an auto-hiding scroller for the 3 people using a IE */
			-ms-overflow-style: -ms-autohiding-scrollbar;
			/* For WebKit implementations, provide inertia scrolling */
			-webkit-overflow-scrolling: touch;
			/* We don't want internal inline elements to wrap */
			white-space: nowrap;
			/* Remove the default scrollbar for WebKit implementations */
			&::-webkit-scrollbar {
				display: none;
			}
		}

		&.is-open {
			animation: ${expand} 0.2s ease forwards;
		}

		&.is-closed {
			animation: ${noexpand} 0.2s ease forwards;
		}

		${props.isDisabled &&
			css`
				opacity: 0.3;
				cursor: not-allowed;
				pointer-events: none;
			`}

		${desktopStyles};
	`
)

const isMobileCheck = () => {
	const ua = navigator.userAgent
	const isAndroid = () => Boolean(ua.match(/Android/i))
	const isIos = () => Boolean(ua.match(/iPhone|iPad|iPod/i))
	const isOpera = () => Boolean(ua.match(/Opera Mini/i))
	const isWindows = () => Boolean(ua.match(/IEMobile/i))

	return Boolean(isAndroid() || isIos() || isOpera() || isWindows())
}

const isMobile = isMobileCheck()
const scheduler = new SchedulerCreator()

const dates = scheduler.datesFrom(new Date(), 7)

const DatePicker = ({ isDisabled, scheduleRanges, value, onSelect }) => {
	const cellsRef = React.useRef()

	return (
		<Wrapper isDisabled={isDisabled} isDesktop={!isMobile}>
			<div className="title">
				<div className="title-date">{!value ? 'Select a date' : format(value, 'MMMM Do')}</div>
			</div>
			<div className="dates">
				<div className="cells" ref={cellsRef}>
					{dates.map((date, idx) => {
						return (
							<DateCell
								key={idx}
								scheduleRanges={scheduleRanges}
								width={50}
								isDesktop={!isMobile}
								isSelected={isSameDay(date, value)}
								date={date}
								onClick={() => onSelect(date)}
							/>
						)
					})}
				</div>
			</div>
		</Wrapper>
	)
}

export default DatePicker
