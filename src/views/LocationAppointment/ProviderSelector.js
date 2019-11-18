import React from 'react'
import styled, { css, keyframes } from 'styled-components'
import useDisclosure from '../../components/useDisclosure'
import { FiChevronDown, FiUser, FiCheck } from 'react-icons/fi'
import useOutsideClick from '@rooks/use-outside-click'

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

			&-item {
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

				.info {
					display: flex;
					align-items: center;
				}

				&-selected {
					background: rgba(249, 251, 252, 1);
				}

				.avatar {
					display: flex;
					align-items: center;
					justify-content: center;
					width: 32px;
					height: 32px;
					border-radius: 50%;
					background: ${props.theme.colors.n450};
					color: white;
					margin-right: 12px;
				}

				&:hover {
					background: rgba(249, 251, 252, 1);
				}

				&:not(:last-of-type) {
					border-bottom: 1px solid rgba(252, 252, 252, 1);
				}
			}
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

const ProviderSelector = ({ value, onSelect, providers }) => {
	const { isOpen, onClose, onToggle } = useDisclosure()
	const dropdownRef = React.useRef()

	function outsidePClick() {
		if (isOpen) {
			onClose()
		}
	}

	useOutsideClick(dropdownRef, outsidePClick)

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

						return (
							<div
								key={provider.id}
								style={{ justifyContent: isSelected ? 'space-between' : 'flex-start' }}
								className={`dropdown-item ${isSelected ? 'dropdown-item-selected' : ''}`}
								onClick={() => {
									onSelect(provider)
									onClose()
								}}
							>
								<div className="info">
									<div className="avatar">
										<FiUser />
									</div>
									{provider.firstName} {provider.lastName && provider.lastName}
								</div>

								{isSelected && <FiCheck className="check" />}
							</div>
						)
					})}
				</div>
			)}
		</Container>
	)
}

export default ProviderSelector
