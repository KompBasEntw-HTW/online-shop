import clsx from 'clsx'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ZodError } from 'zod'
import { DEFAULT_BANK_TRANSFER_DETAILS } from '../../constants/constants'
import { BankTransferDetails } from '../../constants/zod'
import { BankTransferDetailsType } from '../../types'
import { Toast } from '../General'
import { TextField } from '../General/FormFields'

const BankTransferForm = ({
	transferDetails,
	onChangeDetails,
	className
}: {
	transferDetails?: BankTransferDetailsType
	onChangeDetails: (details: BankTransferDetailsType) => void
	className?: string
}) => {
	const formStyles = clsx('mt-6 grid grid-cols-4 gap-y-6 gap-x-4', className)

	const [enteredTransferDetails, setEnteredTransferDetails] = useState<BankTransferDetailsType>(
		transferDetails || DEFAULT_BANK_TRANSFER_DETAILS
	)
	const [errorToast, setErrorToast] = useState({
		title: '',
		description: '',
		show: false
	})

	const firstRun = useRef(true)

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const cachedChangeFunction = useCallback(onChangeDetails, [])

	useEffect(() => {
		if (firstRun.current) {
			firstRun.current = false
			return
		}

		if (
			!enteredTransferDetails ||
			Object.values(enteredTransferDetails).some((value) => value === '')
		) {
			return
		}

		try {
			BankTransferDetails.parse(enteredTransferDetails)
			setErrorToast((state) => ({ ...state, show: false }))
			cachedChangeFunction(enteredTransferDetails)
		} catch (error) {
			const errorMessages = error as ZodError

			setErrorToast((state) => ({
				...state,
				show: true,
				title: 'Error',
				description: errorMessages.issues.map((issue) => issue.message).join('. ')
			}))
		}
	}, [enteredTransferDetails, cachedChangeFunction])

	return (
		<div className={formStyles}>
			<div className='col-span-4'>
				<TextField
					type='text'
					id='account-holder'
					name='account-holder'
					autoComplete='name'
					onChange={(e) =>
						setEnteredTransferDetails((state) => ({
							...state,
							accountHolder: e.target.value
						}))
					}
					label='Account holder'
					value={transferDetails?.accountHolder || ''}
					placeholder='John Doe'
				/>
			</div>

			<div className='col-span-2'>
				<TextField
					type='text'
					id='iban'
					name='iban'
					autoComplete='iban'
					onChange={(e) =>
						setEnteredTransferDetails((state) => ({
							...state,
							iban: e.target.value
						}))
					}
					label='IBAN'
					value={transferDetails?.iban || ''}
					placeholder='DE12345678901234567890'
				/>
			</div>

			<div className='col-span-2'>
				<TextField
					type='text'
					name='bic'
					id='bic'
					autoComplete='bic'
					onChange={(e) =>
						setEnteredTransferDetails((state) => ({
							...state,
							bic: e.target.value
						}))
					}
					label='BIC'
					value={transferDetails?.bic || ''}
					placeholder='DEUTDEFF'
				/>
			</div>

			{errorToast.show && (
				<Toast
					title={errorToast.title}
					description={errorToast.description}
					timeoutTime={100000}
					onFinished={() => setErrorToast((state) => ({ ...state, show: false }))}
				/>
			)}
		</div>
	)
}

export default BankTransferForm
