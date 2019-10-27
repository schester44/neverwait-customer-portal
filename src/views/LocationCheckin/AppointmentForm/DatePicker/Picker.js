import React from 'react'
import styled, { css, keyframes } from 'styled-components'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

import isSameDay from 'date-fns/is_same_day'

import DateCell from './Cell'

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

const Wrapper = styled('div')`
	width: 100%;
	display: flex;
	border-bottom: 1px solid rgba(240, 240, 240, 1);
	height: 80px;
	position: relative;

	.cells {
		flex: 1;
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

	${desktopStyles};
`

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

const DatePicker = ({ isMobile, dates, schedule, maxVisibleDates, selectedDate, onSelect }) => {
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
		<Wrapper isDesktop={!isMobile}>
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
							scheduleRanges={schedule.schedule_ranges}
							width={100 / (maxVisibleDates + 2)}
							isSelected={isSameDay(selectableDate, selectedDate)}
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
		</Wrapper>
	)
}

export default DatePicker
