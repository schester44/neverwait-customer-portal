import React from 'react'
import styled, { css, keyframes } from 'styled-components'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import SchedulerCreator from '../../LocationCheckin/utils/ScheduleCreator'
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
		height: 480px;

		.cells {
			flex-wrap: wrap;
			align-items: flex-start;
			justify-content: flex-start;
		}
	`

const grow = keyframes`
		0% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.2);
		}
		100% {
			transform: scale(1);
		}
`

const Wrapper = styled('div')(
	props => css`
		cursor: pointer;

		background: white;
		border-radius: 8px;
		border: 2px solid rgba(232, 235, 236, 1);
		box-shadow: 0px 3px 5px rgba(232, 235, 236, 0.3);

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

const Button = styled('div')`
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 30px;
	height: 100%;

	transition: opacity 0.5s ease;
	width: 50px;
	pointer-events: none;
	opacity: 0.5;
	animation: ${grow} 5s ease infinite;

	&.left-btn {
		position: absolute;
		left: -15px;
		opacity: 0;
	}

	&.right-btn {
		position: absolute;
		right: -15px;
	}
`

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

const dates = scheduler.datesFrom(new Date(), 30)

const DatePicker = ({ isDisabled, scheduleRanges, value, onSelect }) => {
	const leftBtn = React.useRef()
	const rightBtn = React.useRef()
	const cellsRef = React.useRef()

	React.useEffect(() => {
		const cellContainer = cellsRef.current

		const handler = () => {
			const box = cellsRef.current.getBoundingClientRect()

			if (rightBtn.current) {
				if (cellContainer.scrollLeft + box.width > cellContainer.scrollWidth - 100) {
					rightBtn.current.style.opacity = 0
				} else {
					rightBtn.current.style.opacity = 0.5
				}
			}

			if (leftBtn.current) {
				if (cellContainer.scrollLeft <= 50) {
					leftBtn.current.style.opacity = 0
				} else {
					leftBtn.current.style.opacity = 0.5
				}
			}
		}
		if (cellContainer) {
			cellContainer.addEventListener('scroll', handler)
		}

		return () => {
			if (cellContainer) {
				cellContainer.removeEventListener('scroll', handler)
			}
		}
	}, [])

	return (
		<Wrapper isDisabled={isDisabled} isDesktop={!isMobile}>
			<div className="title">
				<div className="title-date">
					{/* TODO: This date should change, based on the selectedDate and/or the scroll position... or just show the selectedDate value */}
					{!isDisabled && format(new Date(), 'MMMM YYYY')}
				</div>
			</div>
			<div className="dates">
				{!isMobile && (
					<Button
						ref={leftBtn}
						className="left-btn"
						onClick={() => {
							cellsRef.current.scrollLeft = 0
						}}
					>
						<FiChevronLeft />
					</Button>
				)}

				<div className="cells" ref={cellsRef}>
					{dates.map((selectableDate, idx) => {
						return (
							<DateCell
								key={idx}
								scheduleRanges={scheduleRanges}
								width={50}
								isSelected={isSameDay(selectableDate, value)}
								date={selectableDate}
								onClick={() => onSelect(selectableDate)}
							/>
						)
					})}
				</div>

				{!isMobile && (
					<Button
						ref={rightBtn}
						className="right-btn"
						onClick={() => {
							const box = cellsRef.current.getBoundingClientRect()

							cellsRef.current.scrollLeft = box.width + cellsRef.current.scrollLeft
						}}
					>
						<FiChevronRight />
					</Button>
				)}
			</div>
		</Wrapper>
	)
}

export default DatePicker
