import { RadioGroup } from '@headlessui/react'
import { CheckCircleIcon, PlusCircleIcon } from '@heroicons/react/20/solid'
import clsx from 'clsx'
import { useState } from 'react'
import { ShippingAddressType } from '../../types'
import AddressForm from './AddressForm'

type ConditionalAddressFormProps<T> = T extends true
	? {
			isAuthenticated: T
			persistedShippingAddresses: ShippingAddressType[]
		}
	: {
			isAuthenticated: T
			persistedShippingAddresses?: never
		}

const ShippingAddressWidget = ({
	shippingAddress,
	onChangeShippingAddress,
	isAuthenticated,
	persistedShippingAddresses
}: {
	shippingAddress: ShippingAddressType
	onChangeShippingAddress: (address: ShippingAddressType) => void
	isAuthenticated: boolean
} & ConditionalAddressFormProps<boolean>) => {
	const [openForm, setOpenForm] = useState(false)

	if (isAuthenticated) {
		return (
			<>
				<h2 className='mt-10 text-lg font-medium text-gray-900'>Shipping information</h2>
				{!openForm && (
					<RadioGroup
						value={shippingAddress}
						onChange={onChangeShippingAddress}>
						<div className='mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4'>
							{persistedShippingAddresses.map((shippingAddress, id) => (
								<RadioGroup.Option
									key={id}
									value={shippingAddress}
									className={({ checked, active }) =>
										clsx(
											checked ? 'border-transparent bg-amber-50' : 'border-gray-300',
											active ? 'bg-amber-50 ring-2 ring-amber-500' : '',
											'relative flex cursor-pointer rounded-lg border p-4 shadow-xs focus:outline-hidden'
										)
									}>
									{({ checked, active }) => (
										<>
											<span className='flex flex-1'>
												<span className='flex flex-col'>
													<RadioGroup.Label
														as='span'
														className='block text-sm font-medium text-gray-900'>
														{shippingAddress.firstName} {shippingAddress.lastName}
													</RadioGroup.Label>
													<RadioGroup.Description
														as='span'
														className='mt-1 flex items-center text-sm text-gray-500'>
														{shippingAddress.street} {shippingAddress.streetNumber}
													</RadioGroup.Description>
													<RadioGroup.Description
														as='span'
														className='mt-1 flex items-center text-sm text-gray-500'>
														{shippingAddress.city}, {shippingAddress.state}{' '}
														{shippingAddress.postalCode}
													</RadioGroup.Description>
													<RadioGroup.Description
														as='span'
														className='mt-1 flex items-center text-sm text-gray-500'>
														{shippingAddress.country}
													</RadioGroup.Description>
												</span>
											</span>
											{checked ? (
												<CheckCircleIcon
													className='h-6 w-6 text-amber-600'
													aria-hidden='true'
												/>
											) : null}
											<span
												className={clsx(
													active ? 'border' : 'border-2',
													checked ? 'border-amber-500' : 'border-transparent',
													'pointer-events-none absolute -inset-px rounded-lg'
												)}
												aria-hidden='true'
											/>
										</>
									)}
								</RadioGroup.Option>
							))}
						</div>
					</RadioGroup>
				)}

				<button
					className='mt-6 flex w-full items-center justify-center gap-x-2 rounded-md border border-transparent bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-500 shadow-xs hover:border-zinc-200 focus:outline-hidden'
					onClick={() => setOpenForm((state) => !state)}>
					<span>Add a new address</span>
					<PlusCircleIcon className='h-6 w-6' />
				</button>

				{openForm && (
					<AddressForm
						shippingAddress={shippingAddress}
						isAuthenticated={isAuthenticated}
						onChangeShippingAddress={onChangeShippingAddress}
					/>
				)}
			</>
		)
	}

	return (
		<>
			<h2 className='mt-10 text-lg font-medium text-gray-900'>Shipping information</h2>
			<AddressForm
				shippingAddress={shippingAddress}
				isAuthenticated={isAuthenticated}
				onChangeShippingAddress={onChangeShippingAddress}
			/>
		</>
	)
}

export default ShippingAddressWidget
