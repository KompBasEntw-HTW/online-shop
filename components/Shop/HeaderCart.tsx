import { ShoppingCartIcon } from '@heroicons/react/24/solid'
import { Popover, Transition } from '@headlessui/react'
import Image from 'next/image'
import { useCartContext } from '../../context/CartContext'
import clsx from 'clsx'
import { XCircleIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'

const HeaderCart = () => {
  const cartContext = useCartContext()

  return (
    <>
      <Popover className='relative z-50'>
        <Popover.Button className='flex items-center'>
          <div className='group relative hover:cursor-pointer'>
            <ShoppingCartIcon
              className='h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500'
              aria-hidden='true'
            />
            <span
              className={clsx(
                'absolute -top-1.5 -right-1.5 ml-2 h-4 w-4 text-xs font-medium',
                cartContext?.cart?.length === 0
                  ? 'flex items-center justify-center rounded-full bg-gray-100 p-1 text-gray-700 group-hover:bg-gray-200 group-hover:text-gray-800'
                  : 'flex  items-center justify-center rounded-full bg-amber-500 p-1 text-white group-hover:bg-amber-600'
              )}>
              {cartContext.cart.length}
            </span>
            <span className='sr-only'>items in cart, view bag</span>
          </div>
        </Popover.Button>

        <Transition
          enter='transition duration-100 ease-out'
          enterFrom='transform scale-95 opacity-0'
          enterTo='transform scale-100 opacity-100'
          leave='transition duration-75 ease-out'
          leaveFrom='transform scale-100 opacity-100'
          leaveTo='transform scale-95 opacity-0'>
          <Popover.Panel className='absolute right-0 top-2 w-screen max-w-xs rounded-md border border-zinc-100 bg-white p-4 shadow-md'>
            <h2 className='font-sans text-xs font-semibold uppercase tracking-tight text-gray-500'>
              Your shopping cart
            </h2>
            {cartContext.cart.length === 0 && (
              <div className='bg- my-2 flex h-40 flex-col items-center justify-center rounded-md border border-zinc-100 bg-zinc-50'>
                <ShoppingCartIcon className='h-8 w-8 text-gray-400' />
                <p className='text-sm text-gray-500'>Your cart is empty</p>
              </div>
            )}
            {cartContext.cart.length > 0 && (
              <ul className='flex flex-col gap-2 py-4'>
                {cartContext.cart.map(item => (
                  <li
                    key={item.product.id + item.size.bagSize.id}
                    className='relative flex gap-2 rounded-md border border-zinc-100 p-2'>
                    <div className='shrink-0 rounded-md border border-amber-100 bg-amber-50'>
                      <span className='sr-only'>{item.product.name}</span>
                      <Image
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        width={64}
                        height={64}
                      />
                    </div>
                    <div className='flex flex-col justify-center pr-3'>
                      <h3 className='text-base line-clamp-1'>{item.product.name}</h3>
                      <p className='text-xs'>{item.size.bagSize.weightInGrams}g</p>
                      <p className='text-xs'>Quantity: {item.quantity}</p>
                    </div>
                    <button
                      className='absolute top-1 right-1'
                      type='button'
                      onClick={() =>
                        cartContext?.removeItem(item.product.id, item.size.bagSize.id)
                      }>
                      <XCircleIcon className='h-6 w-6 text-gray-400 hover:text-gray-500' />
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <Link href='/cart'>
              <button
                type='button'
                className='inline-flex w-full justify-center rounded-md border border-transparent bg-amber-500  py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2'>
                <span className='sr-only'>View full cart</span>
                View full cart
              </button>
            </Link>
          </Popover.Panel>
        </Transition>
      </Popover>
    </>
  )
}

export default HeaderCart
