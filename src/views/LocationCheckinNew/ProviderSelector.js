import React from 'react'
import styled, { css, keyframes } from 'styled-components'
import useDisclosure from '../../components/useDisclosure'
import { FiChevronDown, FiUser } from 'react-icons/fi'
import useOutsideClick from '@rooks/use-outside-click'
import ProviderItem from './ProviderItem'
import Button from '../../components/Button'
import { generatePath, Link } from 'react-router-dom'
import { LOCATION_APPOINTMENT } from '../../routes'

const open = keyframes`
    from {
        opacity: 0;
        transform: translateY(-20px);
    } to {
        opacity: 1;
        transform: translateY(-0px);
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
			top: 20px;
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

		.selected-provider {
			padding: 10px;
			display: flex;
			align-items: center;
			cursor: pointer;
			padding: 20px;
			font-size: 20px;
			font-weight: 700;

			.check {
				color: ${props.theme.colors.success};
			}

			.avatar {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 32px;
				height: 32px;
				border-radius: 50%;
				background: ${props.theme.colors.brand};
				color: white;
				margin-right: 12px;
			}
		}

		.dropdown {
			position: absolute;
			top: 65px;
			animation: ${open} 0.1s ease forwards;
			border-radius: 8px;
			background: white;
			box-shadow: 0 2px 5px rgba(32, 32, 32, 0.1);
			width: 100%;
			z-index: 999;
			overflow-x: hidden;
			overflow-y: auto;
			-webkit-overflow-scrolling: touch;
			max-height: 600px;
		}

		.selector {
			cursor: pointer;
			width: 100%;
			height: 60px;
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
	`
)

const ProviderSelector = ({ uuid, value, onSelect, providers }) => {
	const { isOpen, onClose, onToggle } = useDisclosure()
	const dropdownRef = React.useRef()

	function outsidePClick() {
		if (isOpen) {
			onClose()
		}
	}

	useOutsideClick(dropdownRef, outsidePClick)

	const isAnyEmployeesAvailable = providers.some(p => !!p.isSchedulable)

	return (
		<Container>
			<div className="selector" onClick={onToggle}>
				{!value ? (
					'Select Provider'
				) : (
					<div className="selected-provider" style={{ paddingLeft: 0 }}>
						<div className="avatar">
							<FiUser />
						</div>
						{value.firstName} {value.lastName && value.lastName}
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
					{providers.map(provider => {
						const isSelected = value && value.id === provider.id
						const isWorking = !!provider.currentShift
						const isAcceptingCheckins = provider?.currentShift?.acceptingCheckins
						const isDisabled =
							(!provider.isSchedulable || !isWorking || !isAcceptingCheckins) &&
							!provider?.sourcesNextShifts?.acceptingCheckins

						return (
							<ProviderItem
								key={provider.id}
								isWorking={isWorking}
								isAcceptingCheckins={isAcceptingCheckins}
								isSelected={isSelected}
								provider={provider}
								isDisabled={isDisabled}
								onSelect={() => {
									if (!provider.isSchedulable || !isWorking || !isAcceptingCheckins) return

									onSelect(provider)
									onClose()
								}}
							/>
						)
					})}

					{!isAnyEmployeesAvailable && (
						<div style={{ padding: 10 }}>
							<p style={{ textAlign: 'center', marginTop: 14 }}>Select a provider from above, or</p>
							<Link to={generatePath(LOCATION_APPOINTMENT, { uuid })}>
								<Button ghost style={{ marginTop: 14, width: '100%' }}>
									Book An Appointment
								</Button>
							</Link>
						</div>
					)}
				</div>
			)}
		</Container>
	)
}

export default ProviderSelector
