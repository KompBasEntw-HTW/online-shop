import { useEffect, useReducer, useState } from 'react'
import { useRouter } from 'next/router'
import { useSession, getCsrfToken } from 'next-auth/react'

import { Layout } from '../components/General'
import { useCartContext } from '../context/CartContext'
import {
  DescriptionListItem,
  SingleCheckoutItem,
  ShippingMethodWidget,
  PaymentMethodWidget,
  ShippingAddressWidget
} from '../components/Checkout/'
import { CheckCircleIcon, ShoppingCartIcon, UserIcon } from '@heroicons/react/24/solid'

import EmailWidget from '../components/Checkout/EmailWidget'

import { isLoggedInUserCheckoutState, isLoggedOutUserCheckoutState } from '../helpers/type-helpers'
import { sortCartItems } from '../helpers/cart'
import {
  isValidCheckoutState,
  basketItemsToCheckoutItems,
  getShippingAddresses,
  placeOrder,
  saveShippingAddress
} from '../helpers/checkout'
import {
  calculateSubtotal,
  roundToTwoDecimals,
  calculateTax,
  calculateTotal,
  calculateHasDiscountedShipping,
  calculateShippingCost
} from '../helpers/price-calculation'

import { INITIAL_CHECKOUT_STATE } from '../constants/checkout'
import {
  DISCOUNTED_SHIPPING_THRESHOLD,
  SHIPPING_METHODS,
  DEFAULT_ADDRESS,
  DEFAULT_CREDIT_CARD_DETAILS,
  TAX_RATE
} from '../constants/constants'

import { CheckoutItem, CheckoutState, CheckoutReducerAction } from '../types'

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
            if ('id' in state.shippingAddress) {
              const checkoutItems: CheckoutItem[] = cartContext.cart.map(item => {
                return {
                  itemId: {
                    productId: item.product.id,
                    bagSizeId: item.size.bagSize.id
                  },
                  quantity: item.size.quantity
                }
              })
              placeOrder(checkoutItems, state.shippingAddress.id, session?.data?.accessToken).then(
                order => {
                  if (!order) return
                  router.push('/order-confirmation')
                }
              )
            } else {
              saveShippingAddress(state.shippingAddress, session?.data?.accessToken).then(
                addressId => {
                  if (!addressId) return
                  const checkoutItems = basketItemsToCheckoutItems(cartContext.cart)
                  placeOrder(checkoutItems, addressId, session?.data?.accessToken).then(order => {
                    if (!order) return
                    router.push('/order-confirmation')
                  })
                }
              )
            }
          } catch (error) {
            console.log(error)
          }
        } else {
          try {
            saveShippingAddress(state.shippingAddress, null, state.email).then(addressId => {
              if (!addressId) return
              const checkoutItems = basketItemsToCheckoutItems(cartContext.cart)

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

  const [checkoutState, dispatch] = useReducer(checkoutReducer, INITIAL_CHECKOUT_STATE)

  useEffect(() => {
    async function getAuth() {
      const crsfToken = await getCsrfToken()
      setCsrfToken(crsfToken || '')
    }
    getAuth()
  }, [])

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

      // If the user is logged in, reset the checkout state to the initial state for logged in users
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
  }, [session.status, session.data?.accessToken])

  const subtotal = calculateSubtotal(cartContext.cart)

  const hasDiscountedShipping = calculateHasDiscountedShipping(
    subtotal,
    DISCOUNTED_SHIPPING_THRESHOLD
  )
  const shippingCost = calculateShippingCost(
    hasDiscountedShipping,
    checkoutState.selectedShippingMethod.reducedPrice,
    checkoutState.selectedShippingMethod.basePrice
  )

  const tax = calculateTax(subtotal, shippingCost, TAX_RATE)
  const total = calculateTotal(subtotal, shippingCost, tax)

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

  const sortedCart = sortCartItems(cartContext.cart)

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

            {session.status === 'authenticated' && isLoggedInUserCheckoutState(checkoutState) && (
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
                  hasDiscountedShippingCost={hasDiscountedShipping}
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

            {session.status === 'unauthenticated' &&
              isLoggedOutUserCheckoutState(checkoutState) && (
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
                    hasDiscountedShippingCost={hasDiscountedShipping}
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
                {hasDiscountedShipping && (
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
                {!hasDiscountedShipping && (
                  <div className='flex items-center gap-x-2 rounded-md border border-amber-200 bg-amber-50 px-4 py-2'>
                    <ShoppingCartIcon className='h-6 w-6 shrink-0 text-amber-600' />
                    <div>
                      <p className='text-sm font-semibold text-gray-800'>
                        You&#39;re almost there!
                      </p>
                      <p className='text-xs text-gray-600'>
                        Spend ${roundToTwoDecimals(DISCOUNTED_SHIPPING_THRESHOLD - subtotal)} more
                        to get free standard shipping.
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
