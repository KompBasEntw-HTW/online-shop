import Image from 'next/image'
import Link from 'next/link'

const bottomLinks = [
  { name: 'Imprint', href: '/imprint' },
  { name: 'Privacy', href: '/privacy' },
  { name: 'Terms', href: '/terms' }
]

const Footer = () => {
  return (
    <footer aria-labelledby='footer-heading' className='bg-white'>
      <h2 id='footer-heading' className='sr-only'>
        Footer
      </h2>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='border-t border-gray-200'>
          <div className='py-8'>
            <div className='md:flex md:justify-center'>
              <Image
                src='https://tailwindui.com/img/logos/mark.svg?color=amber&shade=600'
                alt=''
                className='h-8 w-auto'
                width={32}
                height={32}
              />
            </div>
          </div>
        </div>

        <div className='py-10 md:flex md:items-center md:justify-between'>
          <div className='text-center md:text-left'>
            <p className='text-sm text-gray-500'>
              Extreme Coffee Experience &copy; 2022, all rights reserved
            </p>
          </div>

          <div className='mt-4 flex items-center justify-center md:mt-0'>
            <div className='flex space-x-8'>
              {bottomLinks.map(item => (
                <Link
                  key={item.name}
                  href={item.href}
                  className='text-sm text-gray-500 hover:text-gray-600'>
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
