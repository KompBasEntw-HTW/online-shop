import { SUPPORTED_COUNTRIES, DEFAULT_ADDRESS } from '../../constants/constants'
import { ShippingAddressType } from '../../types'
import { CheckboxField, SelectField, TextField } from '../General/FormFields'
import { useCallback, useEffect, useRef, useState } from 'react'
import { RadioGroup } from '@headlessui/react'
import clsx from 'clsx'
import { CheckCircleIcon, PlusCircleIcon } from '@heroicons/react/20/solid'
import { ShippingAddress } from '../../constants/zod'

const AddressForm = ({
  shippingAddress,
  onChangeShippingAddress,
  isAuthenticated
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

    if (!enteredAddress || Object.values(enteredAddress).some(value => value === '')) return

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
        onChange={e =>
          setEnteredAddress(state => ({
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
        onChange={e =>
          setEnteredAddress(state => ({
            ...state,
            lastName: e.target.value
          }))
        }
      />

      <TextField
        type='text'
        name='address'
        id='address'
        autoComplete='street-address'
        placeholder='1234 Main St'
        label='Address'
        className='sm:col-span-2'
        value={shippingAddress.address}
        onChange={e =>
          setEnteredAddress(state => ({
            ...state,
            address: e.target.value
          }))
        }
      />

      <TextField
        type='text'
        name='apartment'
        id='apartment'
        label='Apartment, suite, etc.'
        placeholder='4th floor'
        className='sm:col-span-2'
        required={false}
        value={shippingAddress.apartment || ''}
        onChange={e =>
          setEnteredAddress(state => ({
            ...state,
            apartment: e.target.value
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
        onChange={e =>
          setEnteredAddress(state => ({
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
        onChange={e =>
          setEnteredAddress(state => ({
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
        onChange={e =>
          setEnteredAddress(state => ({
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
        value={shippingAddress.zip}
        onChange={e =>
          setEnteredAddress(state => ({
            ...state,
            zip: e.target.value
          }))
        }
      />

      {isAuthenticated && (
        <CheckboxField
          name='save-address'
          id='save-address'
          autoComplete='save-address'
          label='Save this address for next time'
          required={false}
          checked={shippingAddress?.saveToDatabase || false}
          onChange={e =>
            setEnteredAddress(state => ({
              ...state,
              saveToDatabase: e.target.checked
            }))
          }
        />
      )}
    </div>
  )
}

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
        <RadioGroup value={shippingAddress} onChange={onChangeShippingAddress}>
          <div className='mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4'>
            {persistedShippingAddresses.map((shippingAddress, id) => (
              <RadioGroup.Option
                key={id}
                value={shippingAddress}
                className={({ checked, active }) =>
                  clsx(
                    checked ? 'border-transparent bg-amber-50' : 'border-gray-300',
                    active ? 'bg-amber-50 ring-2 ring-amber-500' : '',
                    'relative flex cursor-pointer rounded-lg border  p-4 shadow-sm focus:outline-none'
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
                          {shippingAddress.address}
                        </RadioGroup.Description>
                        <RadioGroup.Description
                          as='span'
                          className='mt-1 flex items-center text-sm text-gray-500'>
                          {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zip}
                        </RadioGroup.Description>
                        <RadioGroup.Description
                          as='span'
                          className='mt-1 flex items-center text-sm text-gray-500'>
                          {shippingAddress.country}
                        </RadioGroup.Description>
                      </span>
                    </span>
                    {checked ? (
                      <CheckCircleIcon className='h-6 w-6 text-amber-600' aria-hidden='true' />
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
        <button
          className='mt-6 flex w-full items-center justify-center gap-x-2 rounded-md border border-transparent bg-zinc-50 py-2 px-4 text-sm font-medium text-zinc-500 shadow-sm hover:border-zinc-200 focus:outline-none'
          onClick={() => setOpenForm(state => !state)}>
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
