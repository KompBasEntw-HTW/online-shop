import { UserIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import Link from 'next/link'
import HeaderCart from '../Shop/HeaderCart'

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
                      className='h-10 w-auto'
                      src='/images/android-chrome-192x192.png'
                      alt=''
                      width={192}
                      height={192}
                    />
                  </Link>
                </div>

                <div className='ml-8 hidden h-full gap-x-2 lg:flex '></div>

                {/* Logo (lg-) */}
                <Link href='/' className='lg:hidden'>
                  <span className='sr-only'>Your Company</span>
                  <Image
                    src='/images/android-chrome-192x192.png'
                    alt=''
                    className='h-10 w-auto'
                    width={192}
                    height={192}
                  />
                </Link>

                <div className='flex flex-1 items-center justify-end'>
                  <div className='flex items-center lg:ml-8'>
                    <div className='flex space-x-8'>
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

                    <HeaderCart />
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
