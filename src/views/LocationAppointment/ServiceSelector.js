import React from 'react'
import styled, { css, keyframes } from 'styled-components'
import useDisclosure from '../../components/useDisclosure'
import { FiChevronDown } from 'react-icons/fi'
import useOutsideClick from '@rooks/use-outside-click'
import Button from '../../components/Button'
import timeFragments from '../../helpers/timeFragments'

const open = keyframes`
    from {
        opacity: 0;
        transform: translateY(20px);
    } to {
        opacity: 1;
        transform: translateY(0px);
    }
`

const spin = keyframes`
    to {
        transform: rotate(180deg);
    }
`

const spin2 = keyframes`
    from {
        transform: rotate(180deg);
    }
    to {
        transform: rotate(0deg);
    }
`

const Container = styled('div')(
	props => css`
		width: 100%;
		position: relative;

		.caret {
			position: absolute;
			top: 23px;
			right: 20px;
			opacity: 0.5;

			&-icon {
				&-opened {
					animation: ${spin} 0.2s ease forwards;
				}

				&-closed {
					animation: ${spin2} 0.2s ease forwards;
				}
			}
		}

		.selected-service {
			width: 100%;
			padding: 10px;
			display: flex;
			align-items: center;
			justify-content: space-between;
			cursor: pointer;
			padding: 20px 20px 20px 0px;
			font-size: 20px;

			.checkbox {
				margin-right: 10px;
				width: 20px;
				height: 20px;
				border-radius: 50%;
				border: 2px solid rgba(232, 235, 236, 1);
			}

			.service-name {
				font-weight: 700;
			}

			.service-duration {
				color: ${props.theme.colors.n450};
				font-size: 16px;
				font-weight: 400;
			}

			.service-price {
				font-size: 16px;
				font-weight: 700;
				color: rgba(235, 182, 125, 1);
				background: rgba(253, 241, 227, 1);
				border-radius: 8px;
				padding: 10px;
				margin-right: 10px;
			}
		}

		.dropdown {
			position: fixed;
			bottom: 10px;
			left: 10px;
			animation: ${open} 0.1s ease forwards;
			border-radius: 8px;
			background: white;
			box-shadow: 0 2px 5px rgba(32, 32, 32, 0.1);
			width: calc(100% - 20px);
			z-index: 999;
			overflow-x: hidden;

			@media (min-width: 1200px) {
				max-width: 1200px;
				margin: 0 auto;
				left: calc(50% - 600px);
			}

			.dropdown-done-btn {
				position: absolute;
				bottom: 0;
				left: 0;
				width: 100%;
				padding: 10px;
				background: white;
			}

			.dropdown-scroll-container {
				overflow-x: hidden;
				-webkit-overflow-scrolling: touch;
				height: 650px;
				max-height: 80vh;
				overflow-y: auto;
				padding-bottom: 70px;
			}

			&-item {
				width: 100%;
				padding: 10px;
				display: flex;
				align-items: center;
				justify-content: space-between;
				cursor: pointer;
				padding: 20px 20px 20px 10px;
				font-size: 20px;

				.left {
					display: flex;
					align-items: center;
				}

				.checkbox {
					margin-right: 10px;
					width: 20px;
					height: 20px;
					border-radius: 50%;
					border: 2px solid rgba(232, 235, 236, 1);
				}

				.service-name {
					font-weight: 700;
				}

				.service-duration {
					color: ${props.theme.colors.n450};
					font-size: 16px;
				}

				.service-price {
					font-size: 16px;
					font-weight: 700;
					color: ${props.theme.colors.n450};
				}

				&-selected {
					.checkbox {
						border-color: ${props.theme.colors.success};
						position: relative;

						&:before {
							position: absolute;
							top: 2px;
							left: 2px;
							width: 12px;
							height: 12px;
							border-radius: 50%;
							background: ${props.theme.colors.success};
							content: ' ';
						}
					}
				}

				&:hover {
					background: rgba(249, 251, 252, 1);
				}

				&:not(:last-of-type) {
					border-bottom: 1px solid rgba(249, 250, 252, 1);
				}
			}
		}

		.selector {
			cursor: pointer;
			width: 100%;
			height: 65px;
			background: white;
			border-radius: 8px;
			box-shadow: 1px 1px 2px rgba(32, 32, 32, 0.1), 0px 1px 5px rgba(32, 32, 32, 0.05);
			-webkit-appearance: none;
			
			display: flex;
			align-items: center;
			padding: 10px 15px;
			font-size: 20px;
			font-weight: 700;
		}

		${props.isDisabled &&
			css`
				opacity: 0.3;
				cursor: not-allowed;
				pointer-events: none;
			`}
	`
)

const ProviderSelector = ({
	value = [],
	onSelect,
	services = [],
	selectedServicesPrice,
	selectedServicesTime,
	servicesById,
	isDisabled,
}) => {
	const { isOpen, onClose, onToggle } = useDisclosure()
	const dropdownRef = React.useRef()

	function outsidePClick() {
		if (isOpen) {
			onClose()
		}
	}

	useOutsideClick(dropdownRef, outsidePClick)

	return (
		<Container isDisabled={isDisabled}>
			<div
				className="selector"
				onClick={() => {
					if (!isDisabled) {
						onToggle()
					}
				}}
			>
				{!value || value.length === 0 ? (
					'Select Services'
				) : (
					<div className="selected-service">
						<div className="info">
							<div className="service-name">
								{value.length === 1 ? servicesById[value[0]].name : `${value.length} Services`}
							</div>
							<div className="service-duration">
								{selectedServicesTime.hours === 0
									? `${selectedServicesTime.minutes} minutes`
									: `${selectedServicesTime.hours} hour${
											selectedServicesTime.hours === 1 ? '' : 's'
									  } ${
											selectedServicesTime.minutes !== 0
												? `${selectedServicesTime.minutes} minutes`
												: ''
									  }`}
							</div>
						</div>

						<div className="service-price">${selectedServicesPrice}</div>
					</div>
				)}
				<div className="caret">
					<FiChevronDown
						className={`caret-icon ${isOpen ? 'caret-icon-opened' : 'caret-icon-closed'}`}
					/>
				</div>
			</div>

			{isOpen && (
				<div ref={dropdownRef} className="dropdown">
					{value.length > 0 && (
						<div className="dropdown-done-btn" onClick={onClose}>
							<Button style={{ padding: 10, width: '100%', fontSize: 16 }}>Done</Button>
						</div>
					)}

					<div className="dropdown-scroll-container">
						{services.map(service => {
							const isSelected = value && value.includes(service.id)

							const { hours, minutes } = timeFragments(service.duration)

							return (
								<div
									key={service.id}
									className={`dropdown-item ${isSelected ? 'dropdown-item-selected' : ''}`}
									onClick={() => {
										onSelect(service)
									}}
								>
									<div className="left">
										<div className="checkbox"></div>

										<div className="info">
											<div className="service-name">{service.name}</div>
											<div className="service-duration">
												{hours === 0
													? `${minutes} minutes`
													: `${hours} hour${hours === 1 ? '' : 's'} ${
															minutes !== 0 ? `${minutes} minutes` : ''
													  }`}
											</div>
										</div>
									</div>

									<div className="service-price">${service.price}</div>
								</div>
							)
						})}
					</div>
				</div>
			)}
		</Container>
	)
}

export default ProviderSelector
