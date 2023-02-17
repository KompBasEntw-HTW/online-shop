import { useEffect, useReducer } from 'react'
import { useRouter } from 'next/router'
import { Layout } from '../components/General'
import { useCartContext } from '../context/CartContext'
import { calculateTotalPrice, roundToTwoDecimals } from '../helpers/price-calculation'
import { useSession, getCsrfToken } from 'next-auth/react'
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
  DEFAULT_ADDRESS,
  DEFAULT_CREDIT_CARD_DETAILS
} from '../constants/constants'
import { CheckoutItem, CheckoutState, ShippingAddressType, Order } from '../types'
import EmailWidget from '../components/Checkout/EmailWidget'
import { CheckoutReducerAction } from '../types'
import { ShippingAddress, Email, PaymentMethodDetails, ShippingMethod } from '../constants/zod'
import {
  isLoggedInUserCheckoutState,
  isLoggedOutUserCheckoutState
} from '../helpers/type-predicates'
import { useState } from 'react'

// const testCreditCardDetails: CreditCardDetailsType = {
//   type: 'credit-card',
//   cardNumber: '1234 5678 9012 3456',
//   expirationDate: '12/24',
//   cvv: '123',
//   cardHolder: 'John Doe'
// }

// const testBankTransferDetails: BankTransferDetailsType = {
//   type: 'bank-transfer',
//   accountHolder: 'John Doe',
//   iban: 'DE89370400440532013000',
//   bic: 'DEUTDEFF'
// }

// const storedPaymentDetailsTest: PaymentDetailsType[] = [
//   testBankTransferDetails,
//   testCreditCardDetails
// ]

// const storedShippingAddressesTest: ShippingAddressType[] = [
//   {
//     firstName: 'John',
//     lastName: 'Doe',
//     street: 'Main St',
//     streetNumber: '123',
//     postalCode: '12345',
//     city: 'New York',
//     country: SUPPORTED_COUNTRIES[0],
//     additionalInformation: '1st floor'
//   },
//   {
//     firstName: 'Jane',
//     lastName: 'Doe',
//     street: 'Peter St',
//     streetNumber: '456',
//     postalCode: '12345',
//     city: 'New York',
//     country: SUPPORTED_COUNTRIES[1],
//     state: 'NY'
//   }
// ]

const isValidCheckoutState = (state: CheckoutState) => {
  try {
    if (isLoggedInUserCheckoutState(state)) {
      ShippingAddress.parse(state.shippingAddress)
      PaymentMethodDetails.parse(state.paymentDetails)
      ShippingMethod.parse(state.selectedShippingMethod)
    } else {
      Email.parse(state.email)
      ShippingAddress.parse(state.shippingAddress)
      PaymentMethodDetails.parse(state.paymentDetails)
      ShippingMethod.parse(state.selectedShippingMethod)
    }
    return true
  } catch (err) {
    console.log(err)
    return false
  }
}

const getShippingAddresses = async (
  accessToken?: string | null
): Promise<ShippingAddressType[] | undefined> => {
  try {
    const data = await fetch('/api/checkout-service/addresses', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

    const addresses = await data.json()
    return addresses
  } catch (error) {
    console.log(error)
  }
}

const saveShippingAddress = async (
  shippingAddress: ShippingAddressType,
  accessToken?: string | null,
  userEmail?: string
): Promise<number | undefined> => {
  if (accessToken) {
    try {
      const data = await fetch('/api/checkout-service/addresses/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify(shippingAddress)
      })

      return await data.json()
    } catch (error) {
      console.log(error)
    }
  } else {
    try {
      const data = await fetch('/api/checkout-service/addresses/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...shippingAddress, userName: userEmail })
      })

      return await data.json()
    } catch (error) {
      console.log(error)
    }
  }
}

const placeOrder = async (
  checkoutItems: CheckoutItem[],
  addressId: number,
  accessToken?: string | null,
  userEmail?: string
): Promise<Order | undefined> => {
  if (accessToken) {
    try {
      const data = await fetch('/api/checkout-service/orders/place', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          items: checkoutItems,
          addressId,
          userEmail
        })
      })

      return await data.json()
    } catch (error) {
      console.log(error)
    }
  } else if (userEmail) {
    try {
      const data = await fetch('/api/checkout-service/orders/place', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          items: checkoutItems,
          addressId,
          userEmail
        })
      })

      return await data.json()
    } catch (error) {
      console.log(error)
    }
  }
}

const Checkout = () => {
  const router = useRouter()
  const cartContext = useCartContext()
  const session = useSession()
  const [csrfToken, setCsrfToken] = useState('')

  const checkoutReducer = (state: CheckoutState, action: CheckoutReducerAction): CheckoutState => {
    switch (action.type) {
      case 'RESET_CHECKOUT':
        return {
          ...action.payload
        }
      case 'SET_PERSISTED_SHIPPING_ADDRESSES':
        if (!isLoggedInUserCheckoutState(state)) return state
        return {
          ...state,
          persistedShippingAddresses: action.payload
        }

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
        // in the case that the checkout isn't in a valid state, show an error message
        if (!isValidCheckoutState(state)) return state

        if (isLoggedInUserCheckoutState(state)) {
          try {
            saveShippingAddress(state.shippingAddress, session?.data?.accessToken).then(
              addressId => {
                if (!addressId) return
                const checkoutItems: CheckoutItem[] = cartContext.cart.map(item => {
                  return {
                    itemId: {
                      productId: item.product.id,
                      bagSizeId: item.size.bagSize.id
                    },
                    quantity: item.size.quantity
                  }
                })

                placeOrder(checkoutItems, addressId, session?.data?.accessToken).then(order => {
                  if (!order) return
                  router.push('/order-confirmation')
                })
              }
            )
          } catch (error) {
            console.log(error)
          }
        } else {
          try {
            saveShippingAddress(state.shippingAddress, null, state.email).then(addressId => {
              if (!addressId) return
              const checkoutItems: CheckoutItem[] = cartContext.cart.map(item => {
                return {
                  itemId: {
                    productId: item.product.id,
                    bagSizeId: item.size.bagSize.id
                  },
                  quantity: item.size.quantity
                }
              })

              placeOrder(checkoutItems, addressId, null, state.email).then(order => {
                // If order didn't go through, show an error message
                if (!order) return
                router.push('/order-confirmation')
              })
            })
          } catch (error) {
            console.log(error)
          }
        }

        return state

      default:
        return state
    }
  }

  const initialCheckoutState: CheckoutState = {
    selectedShippingMethod: SHIPPING_METHODS[0],
    email: '',
    shippingAddress: DEFAULT_ADDRESS,
    paymentDetails: DEFAULT_CREDIT_CARD_DETAILS
  }

  const [checkoutState, dispatch] = useReducer(checkoutReducer, initialCheckoutState)

  useEffect(() => {
    async function getAuth() {
      const crsfToken = await getCsrfToken()
      setCsrfToken(crsfToken || '')
    }
    getAuth()
  }, [])

  useEffect(() => {
    if (session.status === 'authenticated') {
      dispatch({
        type: 'RESET_CHECKOUT',
        payload: {
          selectedShippingMethod: SHIPPING_METHODS[0],
          persistedShippingAddresses: [],
          shippingAddress: DEFAULT_ADDRESS,
          persistedPaymentDetails: [],
          paymentDetails: DEFAULT_CREDIT_CARD_DETAILS
        }
      })
    } else {
      dispatch({
        type: 'RESET_CHECKOUT',
        payload: {
          selectedShippingMethod: SHIPPING_METHODS[0],
          email: '',
          shippingAddress: DEFAULT_ADDRESS,
          paymentDetails: DEFAULT_CREDIT_CARD_DETAILS
        }
      })
    }
  }, [session.status])

  useEffect(() => {
    if (session.status === 'authenticated') {
      getShippingAddresses(session?.data?.accessToken).then(addresses => {
        if (addresses) {
          dispatch({
            type: 'SET_PERSISTED_SHIPPING_ADDRESSES',
            payload: addresses
          })
        }
      })
    }
  }, [session])

  const subtotal = cartContext.cart.reduce(
    (total, cartItem) =>
      total +
      calculateTotalPrice(cartItem.product.pricePerKilo, cartItem.quantity, cartItem.size.bagSize),
    0
  )

  const isAuthenticated = session.status === 'authenticated'

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

  const sortedCart = cartContext.cart.sort((a, b) => {
    if (a.product.name < b.product.name) {
      return -1
    } else if (a.product.name > b.product.name) {
      return 1
    } else if (a.size.bagSize.weightInGrams < b.size.bagSize.weightInGrams) {
      return 1
    } else {
      return -1
    }
  })

  return (
    <Layout>
      <div className='mx-auto py-16'>
        <h1 className='sr-only'>Checkout</h1>

        <div className='lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16'>
          <div>
            {session.status === 'loading' && (
              <div className='flex items-center justify-center'>
                <div className='h-16 w-16 animate-spin rounded-full border-b-2 border-amber-500'></div>
              </div>
            )}

            {!isAuthenticated &&
              isLoggedOutUserCheckoutState(checkoutState) &&
              session.status !== 'loading' && (
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
                      <form action='/api/auth/signin/keycloak' method='POST' className='pt-4'>
                        <input type='hidden' name='csrfToken' value={csrfToken} />
                        <input type='hidden' name='callbackUrl' value='/checkout' />
                        <button
                          type='submit'
                          className='rounded-md border border-amber-100 bg-amber-100 px-4 py-1 font-semibold text-amber-600 hover:border-amber-600'>
                          <span>Sign in</span>
                        </button>
                      </form>
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
                {sortedCart.map(cartItem => (
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
