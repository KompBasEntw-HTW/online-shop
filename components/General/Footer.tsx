import Image from 'next/image'

const footerNavigation = {
  products: [
    { name: 'Bags', href: '#' },
    { name: 'Tees', href: '#' },
    { name: 'Objects', href: '#' },
    { name: 'Home Goods', href: '#' },
    { name: 'Accessories', href: '#' }
  ],
  customerService: [
    { name: 'Contact', href: '#' },
    { name: 'Shipping', href: '#' },
    { name: 'Returns', href: '#' },
    { name: 'Warranty', href: '#' },
    { name: 'Secure Payments', href: '#' },
    { name: 'FAQ', href: '#' },
    { name: 'Find a store', href: '#' }
  ],
  company: [
    { name: 'Who we are', href: '#' },
    { name: 'Sustainability', href: '#' },
    { name: 'Press', href: '#' },
    { name: 'Careers', href: '#' },
    { name: 'Terms & Conditions', href: '#' },
    { name: 'Privacy', href: '#' }
  ],
  legal: [
    { name: 'Terms of Service', href: '#' },
    { name: 'Return Policy', href: '#' },
    { name: 'Privacy Policy', href: '#' },
    { name: 'Shipping Policy', href: '#' }
  ],
  bottomLinks: [
    { name: 'Accessibility', href: '#' },
    { name: 'Privacy', href: '#' },
    { name: 'Terms', href: '#' }
  ]
}

const Footer = () => {
  return (
    <footer aria-labelledby='footer-heading' className='bg-white'>
      <h2 id='footer-heading' className='sr-only'>
        Footer
      </h2>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='border-t border-gray-200'>
          <div className='pt-16 pb-20'>
            <div className='md:flex md:justify-center'>
              <Image
                src='https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600'
                alt=''
                className='h-8 w-auto'
                width={32}
                height={32}
              />
            </div>
            <div className='mx-auto mt-16 max-w-5xl xl:grid xl:grid-cols-2 xl:gap-8'>
              <div className='grid grid-cols-2 gap-8 xl:col-span-2'>
                <div className='space-y-12 md:grid md:grid-cols-2 md:gap-8 md:space-y-0'>
                  <div>
                    <h3 className='text-sm font-medium text-gray-900'>Products</h3>
                    <ul role='list' className='mt-6 space-y-6'>
                      {footerNavigation.products.map(item => (
                        <li key={item.name} className='text-sm'>
                          <a href={item.href} className='text-gray-500 hover:text-gray-600'>
                            {item.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className='text-sm font-medium text-gray-900'>Customer Service</h3>
                    <ul role='list' className='mt-6 space-y-6'>
                      {footerNavigation.customerService.map(item => (
                        <li key={item.name} className='text-sm'>
                          <a href={item.href} className='text-gray-500 hover:text-gray-600'>
                            {item.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className='space-y-12 md:grid md:grid-cols-2 md:gap-8 md:space-y-0'>
                  <div>
                    <h3 className='text-sm font-medium text-gray-900'>Company</h3>
                    <ul role='list' className='mt-6 space-y-6'>
                      {footerNavigation.company.map(item => (
                        <li key={item.name} className='text-sm'>
                          <a href={item.href} className='text-gray-500 hover:text-gray-600'>
                            {item.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className='text-sm font-medium text-gray-900'>Legal</h3>
                    <ul role='list' className='mt-6 space-y-6'>
                      {footerNavigation.legal.map(item => (
                        <li key={item.name} className='text-sm'>
                          <a href={item.href} className='text-gray-500 hover:text-gray-600'>
                            {item.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='py-10 md:flex md:items-center md:justify-between'>
          <div className='text-center md:text-left'>
            <p className='text-sm text-gray-500'>&copy; 2021 All Rights Reserved</p>
          </div>

          <div className='mt-4 flex items-center justify-center md:mt-0'>
            <div className='flex space-x-8'>
              {footerNavigation.bottomLinks.map(item => (
                <a
                  key={item.name}
                  href={item.href}
                  className='text-sm text-gray-500 hover:text-gray-600'>
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer