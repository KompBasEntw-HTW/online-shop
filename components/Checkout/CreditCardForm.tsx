import { CreditCardDetailsType } from '../../types'
import clsx from 'clsx'
import { TextField, CheckboxField } from '../General/FormFields'
import { useEffect, useRef, useState, useCallback } from 'react'
import { DEFAULT_CREDIT_CARD_DETAILS } from '../../constants/constants'
import { CreditCardDetails } from '../../constants/zod'
import { Toast } from '../General'
import { ZodError } from 'zod'

const CreditCardForm = ({
  cardDetails,
  onChangeDetails,
  isAuthenticated,
  className
}: {
  cardDetails?: CreditCardDetailsType
  onChangeDetails: (details: CreditCardDetailsType) => void
  isAuthenticated: boolean
  className?: string
}) => {
  const formStyles = clsx('mt-6 grid grid-cols-4 gap-y-6 gap-x-4', className)

  const [enteredCardDetails, setEnteredCardDetails] = useState<CreditCardDetailsType>(
    cardDetails || DEFAULT_CREDIT_CARD_DETAILS
  )
  const [errorToast, setErrorToast] = useState({
    title: '',
    description: '',
    show: false
  })

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const cachedChangeFunction = useCallback(onChangeDetails, [])

  const firstRun = useRef(true)

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false
      return
    }

    if (!enteredCardDetails || Object.values(enteredCardDetails).some(value => value === '')) return

    try {
      CreditCardDetails.parse(enteredCardDetails)
      setErrorToast(state => ({ ...state, show: false }))
      cachedChangeFunction(enteredCardDetails)
    } catch (error) {
      const errorMessages = error as ZodError

      console.log(error)

      setErrorToast(state => ({
        ...state,
        show: true,
        title: 'Error',
        description: errorMessages.issues.map(issue => issue.message).join('. ')
      }))
    }
  }, [enteredCardDetails, cachedChangeFunction])

  return (
    <div className={formStyles}>
      <div className='col-span-4'>
        <TextField
          id='card-number'
          name='card-number'
          autoComplete='cc-number'
          onChange={e => setEnteredCardDetails(state => ({ ...state, cardNumber: e.target.value }))}
          value={enteredCardDetails?.cardNumber || ''}
          label='Card number'
          placeholder='1234 5678 9012 3456'
        />
      </div>

      <div className='col-span-4'>
        <TextField
          type='text'
          id='name-on-card'
          name='name-on-card'
          autoComplete='cc-name'
          onChange={e => setEnteredCardDetails(state => ({ ...state, cardHolder: e.target.value }))}
          value={enteredCardDetails?.cardHolder || ''}
          label='Name on card'
          placeholder='John Doe'
        />
      </div>

      <div className='col-span-3'>
        <TextField
          type='text'
          name='expiration-date'
          id='expiration-date'
          autoComplete='cc-exp'
          onChange={e =>
            setEnteredCardDetails(state => ({ ...state, expirationDate: e.target.value }))
          }
          value={enteredCardDetails?.expirationDate || ''}
          label='Expiration date (MM/YY)'
          placeholder='MM/YY'
        />
      </div>

      <div>
        <TextField
          type='text'
          name='cvc'
          id='cvc'
          autoComplete='csc'
          onChange={e => setEnteredCardDetails(state => ({ ...state, cvv: e.target.value }))}
          value={enteredCardDetails?.cvv || ''}
          label='CVC'
          placeholder='123'
        />
      </div>

      {isAuthenticated && (
        <div className='col-span-4'>
          <CheckboxField
            name='save-address'
            id='save-address'
            autoComplete='save-address'
            label='Save this address for next time'
            required={false}
            checked={cardDetails?.saveToDatabase || false}
            onChange={e =>
              setEnteredCardDetails(state => ({
                ...state,
                saveToDatabase: e.target.checked
              }))
            }
          />
        </div>
      )}
      {errorToast.show && (
        <Toast
          title={errorToast.title}
          description={errorToast.description}
          timeoutTime={100000}
          onFinished={() => setErrorToast(state => ({ ...state, show: false }))}
        />
      )}
    </div>
  )
}

export default CreditCardForm
