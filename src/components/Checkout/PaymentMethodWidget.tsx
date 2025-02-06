import { RadioGroup, Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import clsx from 'clsx'
import { useState } from 'react'

import { BankTransferDetailsType, CreditCardDetailsType, PaymentDetailsType } from '../../types'

import { PlusCircleIcon } from '@heroicons/react/24/solid'
import { AVAILABLE_PAYMENT_METHODS } from '../../constants/constants'
import { isBankTransferDetails, isCreditCardDetails } from '../../helpers/type-helpers'
import BankTransferForm from './BankTransferForm'
import CreditCardForm from './CreditCardForm'
import PaymentMethodCard from './PaymentMethodCard'

type ConditonalUserProps =
	| {
			isAuthenticated: true
			persistedPaymentMethods: (BankTransferDetailsType | CreditCardDetailsType)[]
	  }
	| {
			isAuthenticated: false
			persistedPaymentMethods?: never
	  }

// FOR LOGGED IN USERS
// persistedPaymentMethods => the payment methods that the user has stored
// selectedPaymentMethod => the method that the user has selected from the persisted payment methods
// setSelectedPaymentMethod => the function to set the selected payment method
// paymentDetails => the payment details that the user has entered
// onEnterNewPaymentDetails => the function to set the payment details that the user has entered
// isAuthenticated => whether the user is authenticated or not

// FOR GUESTS
// paymentDetails => the payment details that the user has entered
// onEnterNewPaymentDetails => the function to set the payment details that the user has entered
// isAuthenticated => whether the user is authenticated or not

const PaymentForm = ({
	paymentDetails,
	onChangePaymentDetails
}: {
	paymentDetails: PaymentDetailsType | null
	onChangePaymentDetails: (paymentDetails: PaymentDetailsType) => void
}) => {
	return (
		<TabGroup
			as='div'
			className='pt-4'>
			<TabList className='flex'>
				{AVAILABLE_PAYMENT_METHODS.map((paymentMethod) => (
					<Tab
						key={paymentMethod.id}
						className='m-1 rounded-md border border-transparent border-zinc-200 px-4 py-2 text-center text-sm font-medium text-gray-500 hover:border-amber-400 hover:bg-amber-50 hover:text-amber-600 focus:outline-hidden data-selected:border-amber-400 data-selected:bg-amber-50 data-selected:text-amber-600'>
						{paymentMethod.title}
					</Tab>
				))}
			</TabList>
			<TabPanels>
				{AVAILABLE_PAYMENT_METHODS.map((paymentMethod) => {
					switch (paymentMethod.id) {
						case 'credit-card':
							return (
								<TabPanel key={paymentMethod.id}>
									<CreditCardForm
										cardDetails={isCreditCardDetails(paymentDetails) ? paymentDetails : undefined}
										onChangeDetails={onChangePaymentDetails}
									/>
								</TabPanel>
							)
						case 'bank-transfer':
							return (
								<TabPanel key={paymentMethod.id}>
									<BankTransferForm
										transferDetails={
											isBankTransferDetails(paymentDetails) ? paymentDetails : undefined
										}
										onChangeDetails={onChangePaymentDetails}
									/>
								</TabPanel>
							)
						default:
							return null
					}
				})}
			</TabPanels>
		</TabGroup>
	)
}

const PaymentMethodWidget = ({
	isAuthenticated,
	persistedPaymentMethods,
	onChangePaymentDetails,
	paymentDetails
}: {
	paymentDetails: PaymentDetailsType | null
	onChangePaymentDetails: (paymentDetails: PaymentDetailsType) => void
} & ConditonalUserProps) => {
	const [openForm, setOpenForm] = useState(false)

	// If the user is authenticated and has stored payment details, we want to show the payment method widget, with the option to select a stored payment method.
	if (isAuthenticated) {
		return (
			<div className='mt-10 border-t border-gray-200 pt-10'>
				<RadioGroup
					value={paymentDetails}
					onChange={onChangePaymentDetails}>
					<RadioGroup.Label className='font-lora text-lg font-medium text-gray-900'>
						Payment
					</RadioGroup.Label>

					<div className='mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4'>
						{persistedPaymentMethods.map((paymentMethod, idx) => (
							<RadioGroup.Option
								key={idx}
								value={paymentMethod}
								className={({ checked, active }) =>
									clsx(
										checked ? 'border-transparent bg-amber-50' : 'border-gray-300',
										active ? 'bg-amber-50 ring-2 ring-amber-500' : '',
										'relative cursor-pointer rounded-lg border p-4 shadow-xs focus:outline-hidden'
									)
								}>
								{({ checked, active }) => (
									<PaymentMethodCard
										paymentDetails={paymentMethod}
										checked={checked}
										active={active}
									/>
								)}
							</RadioGroup.Option>
						))}
					</div>
				</RadioGroup>
				<button
					className='mt-6 flex w-full items-center justify-center gap-x-2 rounded-md border border-transparent bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-500 shadow-xs hover:border-zinc-200 focus:outline-hidden'
					onClick={() => setOpenForm(!openForm)}>
					<span>Add a new payment method</span>
					<PlusCircleIcon className='h-6 w-6' />
				</button>
				{openForm && (
					<PaymentForm
						paymentDetails={paymentDetails}
						onChangePaymentDetails={onChangePaymentDetails}
					/>
				)}
			</div>
		)
	}

	// If the user is not authenticated, we want to show the payment method widget
	return (
		<div className='mt-10 border-t border-gray-200 pt-10'>
			<h2 className='text-lg font-medium text-gray-900'>Payment</h2>

			<PaymentForm
				paymentDetails={paymentDetails}
				onChangePaymentDetails={onChangePaymentDetails}
			/>
		</div>
	)
}

export default PaymentMethodWidget
