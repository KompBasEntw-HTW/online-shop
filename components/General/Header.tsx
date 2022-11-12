import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  UserIcon
} from '@heroicons/react/24/outline'
import Image from 'next/image'
import Link from 'next/link'

const pages = [{ name: 'Store', href: '/products' }]

const Header = () => {
  return (
    <>
      <header className='relative'>
        <nav aria-label='Top'>
          {/* Secondary navigation */}
          <div className='border-b border-gray-200 bg-white'>
            <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
              <div className='flex h-16 items-center justify-between'>
                {/* Logo (lg+) */}
                <div className='hidden lg:flex lg:items-center'>
                  <Link href='/'>
                    <span className='sr-only'>Your Company</span>
                    <Image
                      className='h-8 w-auto'
                      src='https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600'
                      alt=''
                      width={64}
                      height={64}
                    />
                  </Link>
                </div>

                <div className='ml-8 hidden h-full gap-x-2 lg:flex '>
                  {pages.map(page => (
                    <Link
                      key={page.name}
                      href={page.href}
                      className='flex items-center text-sm font-medium text-gray-700 hover:text-gray-800'>
                      {page.name}
                    </Link>
                  ))}
                </div>

                {/* Logo (lg-) */}
                <Link href='/' className='lg:hidden'>
                  <span className='sr-only'>Your Company</span>
                  <Image
                    src='https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600'
                    alt=''
                    className='h-8 w-auto'
                    width={32}
                    height={32}
                  />
                </Link>

                <div className='flex flex-1 items-center justify-end'>
                  <div className='flex items-center lg:ml-8'>
                    <div className='flex space-x-8'>
                      <div className='hidden lg:flex'>
                        <a href='#' className='-m-2 p-2 text-gray-400 hover:text-gray-500'>
                          <span className='sr-only'>Search</span>
                          <MagnifyingGlassIcon className='h-6 w-6' aria-hidden='true' />
                        </a>
                      </div>

                      <div className='flex'>
                        <Link
                          href='/account'
                          className='-m-2 p-2 text-gray-400 hover:text-gray-500'>
                          <span className='sr-only'>Account</span>
                          <UserIcon className='h-6 w-6' aria-hidden='true' />
                        </Link>
                      </div>
                    </div>

                    <span className='mx-4 h-6 w-px bg-gray-200 lg:mx-6' aria-hidden='true' />

                    <div className='flow-root'>
                      <Link href='/cart' className='group -m-2 flex items-center p-2'>
                        <ShoppingCartIcon
                          className='h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500'
                          aria-hidden='true'
                        />
                        <span className='ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800'>
                          0
                        </span>
                        <span className='sr-only'>items in cart, view bag</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </>
  )
}

export default Header
