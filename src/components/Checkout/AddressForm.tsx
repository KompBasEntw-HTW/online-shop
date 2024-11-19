import { useCallback, useEffect, useRef, useState } from 'react'
import { DEFAULT_ADDRESS, SUPPORTED_COUNTRIES } from '../../constants/constants'
import { ShippingAddress } from '../../constants/zod'
import { ShippingAddressType } from '../../types'
import { SelectField, TextField } from '../General/FormFields'

const AddressForm = ({
	shippingAddress,
	onChangeShippingAddress
}: {
	shippingAddress: ShippingAddressType
	onChangeShippingAddress: (address: ShippingAddressType) => void
	isAuthenticated: boolean
}) => {
	const [enteredAddress, setEnteredAddress] = useState<ShippingAddressType>(
		shippingAddress || DEFAULT_ADDRESS
	)

	const firstRun = useRef(true)
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const cachedChangeFunction = useCallback(onChangeShippingAddress, [])

	useEffect(() => {
		if (firstRun.current) {
			firstRun.current = false
			return
		}

		if (!enteredAddress) return

		try {
			ShippingAddress.parse(enteredAddress)
			cachedChangeFunction(enteredAddress)
		} catch (error) {
			console.log(error)
		}
	}, [enteredAddress, cachedChangeFunction])

	return (
		<div className='mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4'>
			<TextField
				type='text'
				id='first-name'
				name='first-name'
				autoComplete='given-name'
				placeholder='John'
				label='First name'
				value={enteredAddress.firstName}
				onChange={(e) =>
					setEnteredAddress((state) => ({
						...state,
						firstName: e.target.value
					}))
				}
			/>
			<TextField
				type='text'
				id='last-name'
				name='last-name'
				autoComplete='family-name'
				label='Last name'
				placeholder='Doe'
				value={shippingAddress.lastName}
				onChange={(e) =>
					setEnteredAddress((state) => ({
						...state,
						lastName: e.target.value
					}))
				}
			/>
			<TextField
				type='text'
				name='street'
				id='street'
				autoComplete='street-address'
				placeholder='Wilhelminenhofstraße'
				label='Address'
				value={shippingAddress.street}
				onChange={(e) =>
					setEnteredAddress((state) => ({
						...state,
						street: e.target.value
					}))
				}
			/>
			<TextField
				type='text'
				name=''
				id='street-number'
				autoComplete='street-address'
				placeholder='34'
				label='Street number'
				value={shippingAddress.streetNumber}
				onChange={(e) =>
					setEnteredAddress((state) => ({
						...state,
						streetNumber: e.target.value
					}))
				}
			/>
			<TextField
				type='text'
				name='additional-information'
				id='additional-information'
				label='Apartment, suite, etc.'
				placeholder='4th floor'
				className='sm:col-span-2'
				required={false}
				value={shippingAddress.additionalInformation || ''}
				onChange={(e) =>
					setEnteredAddress((state) => ({
						...state,
						additionalInformation: e.target.value
					}))
				}
			/>
			<TextField
				type='text'
				name='city'
				id='city'
				autoComplete='address-level2'
				placeholder='Amsterdam'
				label='City'
				value={shippingAddress.city}
				onChange={(e) =>
					setEnteredAddress((state) => ({
						...state,
						city: e.target.value
					}))
				}
			/>
			<SelectField
				id='country'
				name='country'
				autoComplete='country-name'
				options={SUPPORTED_COUNTRIES}
				label='Country'
				value={shippingAddress.country}
				onChange={(e) =>
					setEnteredAddress((state) => ({
						...state,
						country: e.target.value as ShippingAddressType['country']
					}))
				}
			/>
			<TextField
				type='text'
				name='region'
				id='region'
				autoComplete='address-level1'
				label='State / Province'
				placeholder='North Holland'
				required={false}
				value={shippingAddress.state || ''}
				onChange={(e) =>
					setEnteredAddress((state) => ({
						...state,
						state: e.target.value
					}))
				}
			/>
			<TextField
				type='text'
				name='postal-code'
				id='postal-code'
				autoComplete='postal-code'
				placeholder='1234 AB'
				label='Postal code'
				value={shippingAddress.postalCode}
				onChange={(e) =>
					setEnteredAddress((state) => ({
						...state,
						postalCode: e.target.value
					}))
				}
			/>
		</div>
	)
}

export default AddressForm
