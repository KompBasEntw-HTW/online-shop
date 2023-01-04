import { useState } from 'react'
import { Layout } from '../components/General'
import { z } from 'zod'
import { useCartContext } from '../context/CartContext'
import { calculateTotalPrice, roundToTwoDecimals } from '../helpers/price-calculation'
import { useSession } from 'next-auth/react'
import { UserIcon } from '@heroicons/react/20/solid'
import {
  DescriptionListItem,
  SingleCheckoutItem,
  ShippingMethodWidget
} from '../components/Checkout/'
import { CheckCircleIcon, ShoppingCartIcon } from '@heroicons/react/24/solid'
import {
  FREE_SHIPPING_THRESHOLD,
  deliveryMethods,
  paymentMethods,
  supportedCountries
} from '../constants/constants'

const Address = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  street: z.string().min(1),
  houseNumber: z.string().min(1),
  zipCode: z.string().min(1),
  city: z.string().min(1),
  country: z.string().min(1)
})

const Checkout = () => {
  const cartContext = useCartContext()
  const session = useSession()

  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState(deliveryMethods[0])

  const subtotal = cartContext.cart.reduce(
    (total, cartItem) =>
      total +
      calculateTotalPrice(cartItem.product.pricePerKilo, cartItem.quantity, cartItem.size.bagSize),
    0
  )

  const hasDiscountedShippingCost = subtotal >= FREE_SHIPPING_THRESHOLD
  const shippingCost = hasDiscountedShippingCost
    ? selectedDeliveryMethod.reducedPrice
    : selectedDeliveryMethod.basePrice

  const tax = (subtotal + shippingCost) * 0.19
  const total = subtotal + shippingCost + tax

  return (
    <Layout>
      <div className='mx-auto py-16'>
        <h1 className='sr-only'>Checkout</h1>

        <div className='lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16'>
          {session.status === 'unauthenticated' && (
            <div>
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

              <div className='mt-2 border-t border-dotted border-gray-200 pt-10'>
                <div>
                  <h2 className='text-lg font-medium text-gray-900'>Contact information</h2>

                  <div className='mt-4'>
                    <label
                      htmlFor='email-address'
                      className='block text-sm font-medium text-gray-700'>
                      Email address
                    </label>
                    <div className='mt-1'>
                      <input
                        type='email'
                        id='email-address'
                        name='email-address'
                        autoComplete='email'
                        className='block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm'
                      />
                    </div>
                  </div>
                </div>

                <h2 className='mt-10 text-lg font-medium text-gray-900'>Shipping information</h2>

                <div className='mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4'>
                  <div>
                    <label htmlFor='first-name' className='block text-sm font-medium text-gray-700'>
                      First name
                    </label>
                    <div className='mt-1'>
                      <input
                        type='text'
                        id='first-name'
                        name='first-name'
                        autoComplete='given-name'
                        className='block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm'
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor='last-name' className='block text-sm font-medium text-gray-700'>
                      Last name
                    </label>
                    <div className='mt-1'>
                      <input
                        type='text'
                        id='last-name'
                        name='last-name'
                        autoComplete='family-name'
                        className='block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm'
                      />
                    </div>
                  </div>

                  <div className='sm:col-span-2'>
                    <label htmlFor='address' className='block text-sm font-medium text-gray-700'>
                      Address
                    </label>
                    <div className='mt-1'>
                      <input
                        type='text'
                        name='address'
                        id='address'
                        autoComplete='street-address'
                        className='block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm'
                      />
                    </div>
                  </div>

                  <div className='sm:col-span-2'>
                    <label htmlFor='apartment' className='block text-sm font-medium text-gray-700'>
                      Apartment, suite, etc.
                    </label>
                    <div className='mt-1'>
                      <input
                        type='text'
                        name='apartment'
                        id='apartment'
                        className='block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm'
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor='city' className='block text-sm font-medium text-gray-700'>
                      City
                    </label>
                    <div className='mt-1'>
                      <input
                        type='text'
                        name='city'
                        id='city'
                        autoComplete='address-level2'
                        className='block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm'
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor='country' className='block text-sm font-medium text-gray-700'>
                      Country
                    </label>
                    <div className='mt-1'>
                      <select
                        id='country'
                        name='country'
                        autoComplete='country-name'
                        className='block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm'>
                        {supportedCountries.map(country => (
                          <option key={country.id} value={country.name}>
                            {country.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor='region' className='block text-sm font-medium text-gray-700'>
                      State / Province
                    </label>
                    <div className='mt-1'>
                      <input
                        type='text'
                        name='region'
                        id='region'
                        autoComplete='address-level1'
                        className='block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm'
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor='postal-code'
                      className='block text-sm font-medium text-gray-700'>
                      Postal code
                    </label>
                    <div className='mt-1'>
                      <input
                        type='text'
                        name='postal-code'
                        id='postal-code'
                        autoComplete='postal-code'
                        className='block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm'
                      />
                    </div>
                  </div>
                </div>
              </div>

              <ShippingMethodWidget
                deliveryMethods={deliveryMethods}
                selectedMethod={selectedDeliveryMethod}
                setSelected={setSelectedDeliveryMethod}
                discountedShippingThreshold={hasDiscountedShippingCost}
              />

              {/* Payment */}
              <div className='mt-10 border-t border-gray-200 pt-10'>
                <h2 className='text-lg font-medium text-gray-900'>Payment</h2>

                <fieldset className='mt-4'>
                  <legend className='sr-only'>Payment type</legend>
                  <div className='space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10'>
                    {paymentMethods.map((paymentMethod, paymentMethodIdx) => (
                      <div key={paymentMethod.id} className='flex items-center'>
                        {paymentMethodIdx === 0 ? (
                          <input
                            id={paymentMethod.id}
                            name='payment-type'
                            type='radio'
                            defaultChecked
                            className='h-4 w-4 border-gray-300 text-amber-600 focus:ring-amber-500'
                          />
                        ) : (
                          <input
                            id={paymentMethod.id}
                            name='payment-type'
                            type='radio'
                            className='h-4 w-4 border-gray-300 text-amber-600 focus:ring-amber-500'
                          />
                        )}

                        <label
                          htmlFor={paymentMethod.id}
                          className='ml-3 block text-sm font-medium text-gray-700'>
                          {paymentMethod.title}
                        </label>
                      </div>
                    ))}
                  </div>
                </fieldset>

                <div className='mt-6 grid grid-cols-4 gap-y-6 gap-x-4'>
                  <div className='col-span-4'>
                    <label
                      htmlFor='card-number'
                      className='block text-sm font-medium text-gray-700'>
                      Card number
                    </label>
                    <div className='mt-1'>
                      <input
                        type='text'
                        id='card-number'
                        name='card-number'
                        autoComplete='cc-number'
                        className='block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm'
                      />
                    </div>
                  </div>

                  <div className='col-span-4'>
                    <label
                      htmlFor='name-on-card'
                      className='block text-sm font-medium text-gray-700'>
                      Name on card
                    </label>
                    <div className='mt-1'>
                      <input
                        type='text'
                        id='name-on-card'
                        name='name-on-card'
                        autoComplete='cc-name'
                        className='block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm'
                      />
                    </div>
                  </div>

                  <div className='col-span-3'>
                    <label
                      htmlFor='expiration-date'
                      className='block text-sm font-medium text-gray-700'>
                      Expiration date (MM/YY)
                    </label>
                    <div className='mt-1'>
                      <input
                        type='text'
                        name='expiration-date'
                        id='expiration-date'
                        autoComplete='cc-exp'
                        className='block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm'
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor='cvc' className='block text-sm font-medium text-gray-700'>
                      CVC
                    </label>
                    <div className='mt-1'>
                      <input
                        type='text'
                        name='cvc'
                        id='cvc'
                        autoComplete='csc'
                        className='block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm'
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

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
                <DescriptionListItem
                  descriptionDetails={`$${roundToTwoDecimals(subtotal)} USD`}
                  descriptionTerm='Subtotal'
                />
                <DescriptionListItem
                  descriptionDetails={`$${roundToTwoDecimals(shippingCost)} USD`}
                  descriptionTerm='Shipping'
                />
                <DescriptionListItem
                  descriptionDetails={`$${roundToTwoDecimals(tax)} USD`}
                  descriptionTerm='Taxes'
                />
                <DescriptionListItem
                  descriptionDetails={`$${roundToTwoDecimals(total)} USD`}
                  descriptionTerm='Total'
                />
              </dl>

              <div className='border-t border-gray-200 py-6 px-4 sm:px-6'>
                <button
                  type='submit'
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
