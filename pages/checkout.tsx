import { useEffect, useReducer } from 'react'
import { Layout } from '../components/General'
import { useCartContext } from '../context/CartContext'
import { calculateTotalPrice, roundToTwoDecimals } from '../helpers/price-calculation'
import { useSession } from 'next-auth/react'
import { UserIcon } from '@heroicons/react/20/solid'
import {
  DescriptionListItem,
  SingleCheckoutItem,
  ShippingMethodWidget,
  PaymentMethodWidget,
  ShippingAddressWidget
} from '../components/Checkout/'
import { CheckCircleIcon, ShoppingCartIcon } from '@heroicons/react/24/solid'
import {
  FREE_SHIPPING_THRESHOLD,
  SHIPPING_METHODS,
  SUPPORTED_COUNTRIES,
  DEFAULT_ADDRESS,
  DEFAULT_CREDIT_CARD_DETAILS
} from '../constants/constants'
import {
  BankTransferDetailsType,
  CreditCardDetailsType,
  EmailType,
  LoggedInUserCheckoutState,
  LoggedOutUserCheckoutState,
  CheckoutState,
  PaymentDetailsType,
  ShippingAddressType,
  ShippingMethodType
} from '../types'
import EmailWidget from '../components/Checkout/EmailWidget'
import { ShippingAddress, Email } from '../constants/zod'

const testCreditCardDetails: CreditCardDetailsType = {
  type: 'credit-card',
  cardNumber: '1234 5678 9012 3456',
  expirationDate: '12/24',
  cvv: '123',
  cardHolder: 'John Doe'
}

const testBankTransferDetails: BankTransferDetailsType = {
  type: 'bank-transfer',
  accountHolder: 'John Doe',
  iban: 'DE1234567890',
  bic: 'DEUTDEFF'
}

const storedPaymentDetailsTest: PaymentDetailsType[] = [
  testBankTransferDetails,
  testCreditCardDetails
]

const storedShippingAddressesTest: ShippingAddressType[] = [
  {
    firstName: 'John',
    lastName: 'Doe',
    address: '123 Main St',
    zip: '12345',
    city: 'New York',
    country: SUPPORTED_COUNTRIES[0],
    apartment: '1st floor'
  },
  {
    firstName: 'Jane',
    lastName: 'Doe',
    address: '456 Main St',
    zip: '12345',
    city: 'New York',
    country: SUPPORTED_COUNTRIES[1],
    state: 'NY'
  }
]

type checkoutReducerAction =
  | { type: 'SET_SHIPPING_ADDRESS'; payload: Partial<ShippingAddressType> }
  | { type: 'SET_SHIPPING_METHOD'; payload: ShippingMethodType }
  | {
      type: 'SET_PAYMENT_DETAILS'
      payload: PaymentDetailsType
    }
  | {
      type: 'SAVE_NEW_SHIPPING_ADDRESS'
      payload: ShippingAddressType
    }
  | {
      type: 'SET_PERSISTED_SHIPPING_ADDRESSES'
      payload: ShippingAddressType[]
    }
  | { type: 'SET_EMAIL'; payload: EmailType }
  | { type: 'SUBMIT_ORDER' }

const isLoggedInUserCheckoutState = (state: CheckoutState): state is LoggedInUserCheckoutState =>
  (state as LoggedInUserCheckoutState).persistedShippingAddresses !== undefined

const isLoggedOutUserCheckoutState = (state: CheckoutState): state is LoggedOutUserCheckoutState =>
  (state as LoggedOutUserCheckoutState).email !== undefined

const checkoutReducer = (state: CheckoutState, action: checkoutReducerAction): CheckoutState => {
  switch (action.type) {
    case 'SET_SHIPPING_ADDRESS':
      return {
        ...state,
        shippingAddress: action.payload
      }
    case 'SET_SHIPPING_METHOD':
      return {
        ...state,
        selectedShippingMethod: action.payload
      }
    case 'SET_PAYMENT_DETAILS':
      return {
        ...state,
        paymentDetails: action.payload
      }

    case 'SET_EMAIL':
      if (!isLoggedOutUserCheckoutState(state)) return state

      return {
        ...state,
        email: action.payload
      }

    case 'SUBMIT_ORDER':
      if (isLoggedInUserCheckoutState(state)) {
        const validShippingAddress = ShippingAddress.safeParse(state.shippingAddress)
      } else {
        const validShippingAddress = ShippingAddress.safeParse(state.shippingAddress)
        const validEmail = Email.safeParse(state.email)
        console.log(validEmail)
        return {
          ...state
        }
      }
    default:
      return state
  }
}

const Checkout = () => {
  const cartContext = useCartContext()
  const session = useSession()

  const initialCheckoutState: CheckoutState =
    session.status === 'authenticated'
      ? {
          selectedShippingMethod: SHIPPING_METHODS[0],
          persistedShippingAddresses: [...storedShippingAddressesTest],
          shippingAddress: DEFAULT_ADDRESS,
          persistedPaymentDetails: storedPaymentDetailsTest,
          paymentDetails: DEFAULT_CREDIT_CARD_DETAILS
        }
      : {
          selectedShippingMethod: SHIPPING_METHODS[0],
          email: '',
          shippingAddress: DEFAULT_ADDRESS,
          paymentDetails: DEFAULT_CREDIT_CARD_DETAILS
        }

  const [checkoutState, dispatch] = useReducer(checkoutReducer, initialCheckoutState)

  useEffect(() => {
    if (session.status === 'authenticated') {
      // fetch user data from database
    }
  }, [session])

  const subtotal = cartContext.cart.reduce(
    (total, cartItem) =>
      total +
      calculateTotalPrice(cartItem.product.pricePerKilo, cartItem.quantity, cartItem.size.bagSize),
    0
  )

  const isAuthenticated =
    session.status === 'authenticated' && isLoggedInUserCheckoutState(checkoutState)
  const isNotAuthenticated =
    session.status !== 'authenticated' && isLoggedOutUserCheckoutState(checkoutState)

  const hasDiscountedShippingCost = subtotal >= FREE_SHIPPING_THRESHOLD
  const shippingCost = hasDiscountedShippingCost
    ? checkoutState.selectedShippingMethod.reducedPrice
    : checkoutState.selectedShippingMethod.basePrice

  const tax = (subtotal + shippingCost) * 0.19
  const total = subtotal + shippingCost + tax

  const orderSummary = [
    {
      label: 'Subtotal',
      value: `$${roundToTwoDecimals(subtotal)} USD`
    },
    {
      label: 'Shipping',
      value: `$${roundToTwoDecimals(shippingCost)} USD`
    },
    {
      label: 'Tax',
      value: `$${roundToTwoDecimals(tax)} USD`
    },
    {
      label: 'Total',
      value: `$${roundToTwoDecimals(total)} USD`
    }
  ]

  console.log('checkoutState', checkoutState)

  return (
    <Layout>
      <div className='mx-auto py-16'>
        <h1 className='sr-only'>Checkout</h1>

        <div className='lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16'>
          <div>
            {!isAuthenticated && isLoggedOutUserCheckoutState(checkoutState) && (
              <>
                <div className='col mb-10 flex flex-col place-items-center justify-center rounded-lg border border-zinc-100 bg-gray-50 p-4 md:p-8'>
                  <div className='flex place-content-center place-items-center rounded-full bg-amber-50'>
                    <UserIcon className='h-8 w-8 text-amber-600' />
                  </div>
                  <h2 className='pt-3 text-xl'>Not logged in</h2>
                  <p className='pt-2 text-sm text-gray-600'>
                    Sign in or create an account to continue the checkout process
                  </p>
                  <div className='flex justify-center gap-x-2 pt-4'>
                    <button className='rounded-md border border-transparent bg-amber-500 py-1 px-4 text-base font-medium text-white shadow-sm hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-gray-50'>
                      Log in
                    </button>
                    <button className='rounded-md border border-transparent bg-amber-50 py-1 px-4 text-base font-medium text-amber-600 shadow-sm hover:border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-gray-50'>
                      Sign up
                    </button>
                  </div>
                </div>

                <p className='text-center text-xs font-semibold uppercase tracking-tight'>
                  Or continue as a guest
                </p>

                <div className='mt-2 border-t border-dotted border-gray-200 pt-10'></div>
                <EmailWidget
                  value={checkoutState.email}
                  onChangeEmail={value => {
                    dispatch({ type: 'SET_EMAIL', payload: value })
                  }}
                />
                <ShippingAddressWidget
                  shippingAddress={checkoutState.shippingAddress}
                  onChangeShippingAddress={value => {
                    dispatch({ type: 'SET_SHIPPING_ADDRESS', payload: value })
                  }}
                  isAuthenticated={false}
                />
                <ShippingMethodWidget
                  shippingMethods={SHIPPING_METHODS}
                  selectedMethod={checkoutState.selectedShippingMethod}
                  setSelected={value => {
                    dispatch({ type: 'SET_SHIPPING_METHOD', payload: value })
                  }}
                  hasDiscountedShippingCost={hasDiscountedShippingCost}
                />

                <PaymentMethodWidget
                  paymentDetails={checkoutState.paymentDetails}
                  onChangePaymentDetails={value =>
                    dispatch({
                      type: 'SET_PAYMENT_DETAILS',
                      payload: value
                    })
                  }
                  isAuthenticated={false}
                />
              </>
            )}
            {/* <ShippingAddressWidget
              shippingAddress={checkoutState.shippingAddress}
              onChangeShippingAddress={value => {
                dispatch({ type: 'SET_SHIPPING_ADDRESS', payload: value })
              }}
              persistedShippingAddresses={
                isAuthenticated ? checkoutState.persistedShippingAddresses : undefined
              }
              isAuthenticated={isAuthenticated}
            /> */}

            {isAuthenticated && isLoggedInUserCheckoutState(checkoutState) && (
              <>
                <ShippingAddressWidget
                  shippingAddress={checkoutState.shippingAddress}
                  onChangeShippingAddress={value => {
                    dispatch({ type: 'SET_SHIPPING_ADDRESS', payload: value })
                  }}
                  persistedShippingAddresses={checkoutState.persistedShippingAddresses}
                  isAuthenticated
                />
                <ShippingMethodWidget
                  shippingMethods={SHIPPING_METHODS}
                  selectedMethod={checkoutState.selectedShippingMethod}
                  setSelected={value => {
                    dispatch({ type: 'SET_SHIPPING_METHOD', payload: value })
                  }}
                  hasDiscountedShippingCost={hasDiscountedShippingCost}
                />
                <PaymentMethodWidget
                  paymentDetails={checkoutState.paymentDetails}
                  onChangePaymentDetails={value =>
                    dispatch({
                      type: 'SET_PAYMENT_DETAILS',
                      payload: value
                    })
                  }
                  persistedPaymentMethods={checkoutState.persistedPaymentDetails}
                  isAuthenticated
                />
              </>
            )}
          </div>

          {/* Order summary */}
          <div className='mt-10 lg:mt-0'>
            <h2 className='sr-only'>Order summary</h2>

            <div className='rounded-lg border border-gray-200 bg-white shadow-sm'>
              <h3 className='sr-only'>Items in your cart</h3>
              <ul role='list' className='divide-y divide-gray-200'>
                {cartContext.cart.map(cartItem => (
                  <SingleCheckoutItem
                    key={cartItem.product.id + cartItem.size.bagSize.id}
                    cartItem={cartItem}
                    onQuantityChange={e =>
                      cartContext.updateItems([
                        {
                          item: {
                            productId: cartItem.product.id,
                            bagSizeId: cartItem.size.bagSize.id
                          },
                          quantity: parseInt(e.target.value)
                        }
                      ])
                    }
                    onRemoveItem={() =>
                      cartContext.removeItem(cartItem.product.id, cartItem.size.bagSize.id)
                    }
                  />
                ))}
              </ul>
              <dl className='space-y-6 border-t border-gray-200 py-6 px-4 sm:px-6'>
                {hasDiscountedShippingCost && (
                  <div className='flex items-center gap-x-2 rounded-md border border-amber-200 bg-amber-50 px-4 py-2'>
                    <CheckCircleIcon className='h-6 w-6 shrink-0 text-amber-600' />
                    <div>
                      <p className='text-sm font-semibold text-gray-800'>
                        You&#39;re eligible for free standard shipping!
                      </p>
                      <p className='text-xs text-gray-600'>
                        Select standard shipping, or upgrade to express shipping at a discount.
                      </p>
                    </div>
                  </div>
                )}
                {!hasDiscountedShippingCost && (
                  <div className='flex items-center gap-x-2 rounded-md border border-amber-200 bg-amber-50 px-4 py-2'>
                    <ShoppingCartIcon className='h-6 w-6 shrink-0 text-amber-600' />
                    <div>
                      <p className='text-sm font-semibold text-gray-800'>
                        You&#39;re almost there!
                      </p>
                      <p className='text-xs text-gray-600'>
                        Spend ${roundToTwoDecimals(FREE_SHIPPING_THRESHOLD - subtotal)} more to get
                        free standard shipping.
                      </p>
                    </div>
                  </div>
                )}
                {orderSummary.map((item, index) => (
                  <DescriptionListItem
                    key={index}
                    descriptionDetails={item.value}
                    descriptionTerm={item.label}
                  />
                ))}
              </dl>

              <div className='border-t border-gray-200 py-6 px-4 sm:px-6'>
                <button
                  type='button'
                  onClick={() => dispatch({ type: 'SUBMIT_ORDER' })}
                  className='w-full rounded-md border border-transparent bg-amber-500 py-3 px-4 text-base font-medium text-white shadow-sm hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-gray-50'>
                  Order now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Checkout
