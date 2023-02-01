import { XCircleIcon, ShoppingCartIcon, CheckCircleIcon } from '@heroicons/react/20/solid'
import Image from 'next/image'
import { useCartContext } from '../context/CartContext'
import { Layout } from '../components/General'
import { calculateTotalPrice, roundToTwoDecimals } from '../helpers/price-calculation'
import {
  MAX_QUANTITY,
  FREE_SHIPPING_THRESHOLD,
  STANDARD_SHIPPING_COST,
  DISCOUNTED_STANDARD_SHIPPING_COST
} from '../constants/constants'
import Link from 'next/link'

const Cart = () => {
  const cartContext = useCartContext()

  const subtotal = cartContext.cart.reduce(
    (total, cartItem) =>
      total +
      calculateTotalPrice(cartItem.product.pricePerKilo, cartItem.quantity, cartItem.size.bagSize),
    0
  )

  const hasDiscountedShippingCost = subtotal >= FREE_SHIPPING_THRESHOLD
  const shippingCost = hasDiscountedShippingCost
    ? DISCOUNTED_STANDARD_SHIPPING_COST
    : STANDARD_SHIPPING_COST

  const tax = (subtotal + shippingCost) * 0.19
  const total = subtotal + shippingCost + tax

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
      <div className='bg-white'>
        <div className='mx-auto py-16'>
          <h1 className='text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl'>
            Shopping Cart
          </h1>
          {cartContext.cart.length === 0 && (
            <div className='bg- my-4 flex h-96 flex-col items-center justify-center rounded-md border border-zinc-100 bg-zinc-50'>
              <ShoppingCartIcon className='h-12 w-12 text-gray-400' />
              <h2 className='pt-2'>Your cart is empty</h2>
              <p className='text-base text-gray-500'>
                Add items to your cart in our shop to continue to checkout
              </p>
            </div>
          )}
          {cartContext.cart.length > 0 && (
            <form className='mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16'>
              <section aria-labelledby='cart-heading' className='lg:col-span-7'>
                <h2 id='cart-heading' className='sr-only'>
                  Items in your shopping cart
                </h2>
                <ul role='list' className='flex flex-col gap-2'>
                  {sortedCart.map(cartItem => (
                    <li
                      key={cartItem.product.id + cartItem.size.bagSize.id}
                      className='cart-item relative flex gap-6 rounded-md border border-zinc-100 p-3'>
                      <div className='shrink-0 rounded-md border border-amber-100 bg-amber-50'>
                        <span className='sr-only'>{cartItem.product.name}</span>
                        <Image
                          src={cartItem.product.imageUrl}
                          alt={cartItem.product.name}
                          width={96}
                          height={96}
                        />
                      </div>
                      <div className='flex flex-1 flex-col justify-center pr-8'>
                        <h3 className='text-lg line-clamp-1'>{cartItem.product.name}</h3>
                        <p className='text-sm'>{cartItem.size.bagSize.weightInGrams}g</p>
                        <label
                          htmlFor={`quantity-${cartItem.product.id + cartItem.size.bagSize.id}`}
                          className='sr-only'>
                          Quantity, {cartItem.product.name}
                        </label>
                        <select
                          id={`quantity-${cartItem.product.id + cartItem.size.bagSize.id}`}
                          name={`quantity-${cartItem.product.id + cartItem.size.bagSize.id}`}
                          className='mt-1 w-24 rounded-md border border-gray-300 py-1 text-left text-base font-medium leading-5 text-gray-700 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 sm:text-sm'
                          value={cartItem.quantity}
                          onChange={e =>
                            cartContext?.updateItems([
                              {
                                item: {
                                  productId: cartItem.product.id,
                                  bagSizeId: cartItem.size.bagSize.id
                                },
                                quantity: parseInt(e.target.value)
                              }
                            ])
                          }>
                          {Array.from(
                            Array(
                              cartItem.product.coffeeBagSizes.find(
                                coffeeBagSize =>
                                  coffeeBagSize.bagSize.id === cartItem.size.bagSize.id
                              )?.quantity ?? MAX_QUANTITY
                            ).keys()
                          ).map(i => (
                            <option key={i} value={i + 1}>
                              {i + 1}
                            </option>
                          ))}
                        </select>
                      </div>
                      <button
                        className='absolute top-2 right-2'
                        type='button'
                        onClick={() =>
                          cartContext?.removeItem(cartItem.product.id, cartItem.size.bagSize.id)
                        }>
                        <XCircleIcon className='h-7 w-7 text-gray-400 hover:text-gray-500' />
                      </button>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Order summary */}
              <section
                aria-labelledby='summary-heading'
                className='mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8'>
                <h2 id='summary-heading' className='text-lg font-medium text-gray-900'>
                  Order summary
                </h2>

                <dl className='mt-4 space-y-4'>
                  {hasDiscountedShippingCost && (
                    <div className='flex items-center gap-x-2 rounded-md border border-amber-200 bg-amber-50 px-4 py-2'>
                      <CheckCircleIcon className='h-6 w-6 shrink-0 text-amber-600' />
                      <div>
                        <p className='text-sm font-semibold text-gray-800'>
                          You&#39;re eligible for free standard shipping!
                        </p>
                        <p className='text-xs text-gray-600'>
                          Select standard shipping at checkout, or upgrade to express shipping at a
                          discount.
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
                          Spend ${roundToTwoDecimals(FREE_SHIPPING_THRESHOLD - subtotal)} more to
                          get free standard shipping.
                        </p>
                      </div>
                    </div>
                  )}
                  <div className='flex items-center justify-between pt-2'>
                    <dt className='text-sm text-gray-600'>Subtotal</dt>
                    <dd className='text-sm font-medium text-gray-900' id='subtotal'>
                      ${roundToTwoDecimals(subtotal)}
                    </dd>
                  </div>
                  <div className='flex items-center justify-between border-t border-gray-200 pt-4'>
                    <dt className='flex items-center text-sm text-gray-600'>Shipping estimate</dt>
                    <dd className='text-sm font-medium text-gray-900' id='shipping-cost-estimate'>
                      ${roundToTwoDecimals(shippingCost)}
                    </dd>
                  </div>
                  <div className='flex items-center justify-between border-t border-gray-200 pt-4'>
                    <dt className='flex text-sm text-gray-600'>Tax estimate</dt>
                    <dd className='text-sm font-medium text-gray-900' id='tax-estimate'>
                      ${roundToTwoDecimals(tax)}
                    </dd>
                  </div>
                  <div className='flex items-center justify-between border-t border-gray-200 pt-4'>
                    <dt className='text-base font-medium text-gray-900'>Order total</dt>
                    <dd className='text-base font-medium text-gray-900' id='order-total'>
                      ${roundToTwoDecimals(total)}
                    </dd>
                  </div>
                </dl>

                <div className='mt-6'>
                  <Link href='/checkout'>
                    <button
                      id='checkout-button'
                      type='submit'
                      className='w-full rounded-md border border-transparent bg-amber-500 py-3 px-4 text-base font-medium text-white shadow-sm hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-gray-50'>
                      Checkout
                    </button>
                  </Link>
                </div>
              </section>
            </form>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default Cart
