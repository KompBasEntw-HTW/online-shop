import { RadioGroup } from '@headlessui/react'
import { BuildingOfficeIcon, CreditCardIcon } from '@heroicons/react/24/solid'
import clsx from 'clsx'
import { PaymentDetailsType } from '../../types'

const PaymentMethodCard = ({
	paymentDetails,
	checked,
	active
}: {
	paymentDetails: PaymentDetailsType
	checked: boolean
	active: boolean
}) => {
	switch (paymentDetails.type) {
		case 'credit-card':
			return (
				<>
					<div className='flex items-center justify-between'>
						<RadioGroup.Label
							as='span'
							className='font-lora block text-base font-bold text-gray-900'>
							Credit card
						</RadioGroup.Label>
						{checked ? (
							<CreditCardIcon
								className='h-6 w-6 text-amber-600'
								aria-hidden='true'
							/>
						) : (
							<CreditCardIcon
								className='h-6 w-6 text-gray-400'
								aria-hidden='true'
							/>
						)}
					</div>
					<RadioGroup.Description className='mt-1 flex items-center text-xs text-gray-600 blur-xs'>
						{paymentDetails.cardNumber}
					</RadioGroup.Description>
					<div className='flex items-center justify-between'>
						<RadioGroup.Description
							className={clsx(
								checked ? 'bg-amber-100 text-amber-600' : 'bg-zinc-100 text-gray-500',
								'mt-2 rounded-md px-1 py-0.5 text-xs font-medium'
							)}>
							{paymentDetails.expirationDate}
						</RadioGroup.Description>
						<RadioGroup.Description className='mt-2 text-xs font-medium text-gray-900'>
							{paymentDetails.cardHolder}
						</RadioGroup.Description>
					</div>

					<span
						className={clsx(
							active ? 'border' : 'border-2',
							checked ? 'border-amber-500' : 'border-transparent',
							'pointer-events-none absolute -inset-px rounded-lg'
						)}
						aria-hidden='true'
					/>
				</>
			)
		case 'bank-transfer':
			return (
				<>
					<div className='flex items-center justify-between'>
						<RadioGroup.Label
							as='span'
							className='font-lora block text-base font-bold text-gray-900'>
							Debit card
						</RadioGroup.Label>
						{checked ? (
							<BuildingOfficeIcon
								className='h-6 w-6 text-amber-600'
								aria-hidden='true'
							/>
						) : (
							<BuildingOfficeIcon
								className='h-6 w-6 text-gray-400'
								aria-hidden='true'
							/>
						)}
					</div>
					<RadioGroup.Description className='mt-1 flex items-center text-xs text-gray-600 blur-xs'>
						{paymentDetails.iban}
					</RadioGroup.Description>
					<div className='flex items-center justify-between'>
						<RadioGroup.Description
							className={clsx(
								checked ? 'bg-amber-100 text-amber-600' : 'bg-zinc-100 text-gray-500',
								'mt-2 rounded-md px-1 py-0.5 text-xs font-medium'
							)}>
							{paymentDetails.bic}
						</RadioGroup.Description>
						<RadioGroup.Description className='mt-2 text-xs font-medium text-gray-900'>
							{paymentDetails.accountHolder}
						</RadioGroup.Description>
					</div>

					<span
						className={clsx(
							active ? 'border' : 'border-2',
							checked ? 'border-amber-500' : 'border-transparent',
							'pointer-events-none absolute -inset-px rounded-lg'
						)}
						aria-hidden='true'
					/>
				</>
			)
		default:
			return null
	}
}

export default PaymentMethodCard
