import Image from 'next/image'
import Layout from '../components/General/Layout'

const favorites = [
  {
    id: 1,
    name: 'Black Basic Tee',
    price: '$32',
    href: '#',
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/home-page-03-favorite-01.jpg',
    imageAlt: "Model wearing women's black cotton crewneck tee."
  },
  {
    id: 2,
    name: 'Off-White Basic Tee',
    price: '$32',
    href: '#',
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/home-page-03-favorite-02.jpg',
    imageAlt: "Model wearing women's off-white cotton crewneck tee."
  },
  {
    id: 3,
    name: 'Mountains Artwork Tee',
    price: '$36',
    href: '#',
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/home-page-03-favorite-03.jpg',
    imageAlt:
      "Model wearing women's burgundy red crewneck artwork tee with small white triangle overlapping larger black triangle."
  }
]

const Home = () => {
  return (
    <Layout width='full'>
      {/* Category section */}
      <section aria-labelledby='category-heading' className='bg-gray-50'>
        <div className='mx-auto max-w-7xl py-24 px-4 sm:py-32 sm:px-6 lg:px-8'>
          <div className='sm:flex sm:items-baseline sm:justify-between'>
            <h2 id='category-heading' className='text-2xl font-bold tracking-tight text-gray-900'>
              Shop by Category
            </h2>
            <a
              href='#'
              className='hidden text-sm font-semibold text-indigo-600 hover:text-indigo-500 sm:block'>
              Browse all categories
              <span aria-hidden='true'> &rarr;</span>
            </a>
          </div>

          <div className='mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:grid-rows-2 sm:gap-x-6 lg:gap-8'>
            <div className='aspect-w-2 aspect-h-1 sm:aspect-h-1 sm:aspect-w-1 group overflow-hidden rounded-lg sm:row-span-2'>
              <Image
                src='https://tailwindui.com/img/ecommerce-images/home-page-03-featured-category.jpg'
                alt="Two models wearing women's black cotton crewneck tee and off-white cotton crewneck tee."
                className='object-cover object-center group-hover:opacity-75'
                width={640}
                height={640}
              />
              <div
                aria-hidden='true'
                className='bg-gradient-to-b from-transparent to-black opacity-50'
              />
              <div className='flex items-end p-6'>
                <div>
                  <h3 className='font-semibold text-white'>
                    <a href='#'>
                      <span className='' />
                      New Arrivals
                    </a>
                  </h3>
                  <p aria-hidden='true' className='mt-1 text-sm text-white'>
                    Shop now
                  </p>
                </div>
              </div>
            </div>
            <div className='aspect-w-2 aspect-h-1 sm:aspect-none group overflow-hidden rounded-lg sm:relative sm:h-full'>
              <Image
                src='https://tailwindui.com/img/ecommerce-images/home-page-03-category-01.jpg'
                alt='Wooden shelf with gray and olive drab green baseball caps, next to wooden clothes hanger with sweaters.'
                className='object-cover object-center group-hover:opacity-75 sm:absolute sm:inset-0 sm:h-full sm:w-full'
                width={640}
                height={640}
              />
              <div
                aria-hidden='true'
                className='bg-gradient-to-b from-transparent to-black opacity-50 sm:absolute sm:inset-0'
              />
              <div className='flex items-end p-6 sm:absolute sm:inset-0'>
                <div>
                  <h3 className='font-semibold text-white'>
                    <a href='#'>
                      <span className='absolute inset-0' />
                      Accessories
                    </a>
                  </h3>
                  <p aria-hidden='true' className='mt-1 text-sm text-white'>
                    Shop now
                  </p>
                </div>
              </div>
            </div>
            <div className='aspect-w-2 aspect-h-1 sm:aspect-none group overflow-hidden rounded-lg sm:relative sm:h-full'>
              <Image
                src='https://tailwindui.com/img/ecommerce-images/home-page-03-category-02.jpg'
                alt='Walnut desk organizer set with white modular trays, next to porcelain mug on wooden desk.'
                className='object-cover object-center group-hover:opacity-75 sm:absolute sm:inset-0 sm:h-full sm:w-full'
                width={640}
                height={640}
              />
              <div
                aria-hidden='true'
                className='bg-gradient-to-b from-transparent to-black opacity-50 sm:absolute sm:inset-0'
              />
              <div className='flex items-end p-6 sm:absolute sm:inset-0'>
                <div>
                  <h3 className='font-semibold text-white'>
                    <a href='#'>
                      <span className='' />
                      Workspace
                    </a>
                  </h3>
                  <p aria-hidden='true' className='mt-1 text-sm text-white'>
                    Shop now
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className='mt-6 sm:hidden'>
            <a
              href='#'
              className='block text-sm font-semibold text-indigo-600 hover:text-indigo-500'>
              Browse all categories
              <span aria-hidden='true'> &rarr;</span>
            </a>
          </div>
        </div>
      </section>

      {/* Featured section */}
      <section aria-labelledby='cause-heading'>
        <div className='relative bg-gray-800 py-32 px-6 sm:py-40 sm:px-12 lg:px-16'>
          <div className='absolute inset-0 overflow-hidden'>
            <Image
              src='https://tailwindui.com/img/ecommerce-images/home-page-03-feature-section-full-width.jpg'
              alt=''
              className='h-full w-full object-cover object-center'
              width={1920}
              height={1280}
            />
          </div>
          <div aria-hidden='true' className='absolute inset-0 bg-gray-900 bg-opacity-50' />
          <div className='relative mx-auto flex max-w-3xl flex-col items-center text-center'>
            <h2
              id='cause-heading'
              className='text-3xl font-bold tracking-tight text-white sm:text-4xl'>
              Long-term thinking
            </h2>
            <p className='mt-3 text-xl text-white'>
              We're committed to responsible, sustainable, and ethical manufacturing. Our
              small-scale approach allows us to focus on quality and reduce our impact. We're doing
              our best to delay the inevitable heat-death of the universe.
            </p>
            <a
              href='#'
              className='mt-8 block w-full rounded-md border border-transparent bg-white py-3 px-8 text-base font-medium text-gray-900 hover:bg-gray-100 sm:w-auto'>
              Read our story
            </a>
          </div>
        </div>
      </section>

      {/* Favorites section */}
      <section aria-labelledby='favorites-heading'>
        <div className='mx-auto max-w-7xl py-24 px-4 sm:py-32 sm:px-6 lg:px-8'>
          <div className='sm:flex sm:items-baseline sm:justify-between'>
            <h2 id='favorites-heading' className='text-2xl font-bold tracking-tight text-gray-900'>
              Our Favorites
            </h2>
            <a
              href='#'
              className='hidden text-sm font-semibold text-indigo-600 hover:text-indigo-500 sm:block'>
              Browse all favorites
              <span aria-hidden='true'> &rarr;</span>
            </a>
          </div>

          <div className='mt-6 grid grid-cols-1 gap-y-10 sm:grid-cols-3 sm:gap-y-0 sm:gap-x-6 lg:gap-x-8'>
            {favorites.map(favorite => (
              <div key={favorite.id} className='group relative'>
                <div className='sm:aspect-w-2 sm:aspect-h-3 h-96 w-full overflow-hidden rounded-lg group-hover:opacity-75 sm:h-auto'>
                  <Image
                    src={favorite.imageSrc}
                    alt={favorite.imageAlt}
                    className='h-full w-full object-cover object-center'
                    width={640}
                    height={640}
                  />
                </div>
                <h3 className='mt-4 text-base font-semibold text-gray-900'>
                  <a href={favorite.href}>
                    <span className='absolute inset-0' />
                    {favorite.name}
                  </a>
                </h3>
                <p className='mt-1 text-sm text-gray-500'>{favorite.price}</p>
              </div>
            ))}
          </div>

          <div className='mt-6 sm:hidden'>
            <a
              href='#'
              className='block text-sm font-semibold text-indigo-600 hover:text-indigo-500'>
              Browse all favorites
              <span aria-hidden='true'> &rarr;</span>
            </a>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section aria-labelledby='sale-heading'>
        <div className='overflow-hidden pt-32 sm:pt-14'>
          <div className='bg-gray-800'>
            <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
              <div className='relative pt-48 pb-16 sm:pb-24'>
                <div>
                  <h2
                    id='sale-heading'
                    className='text-4xl font-bold tracking-tight text-white md:text-5xl'>
                    Final Stock.
                    <br />
                    Up to 50% off.
                  </h2>
                  <div className='mt-6 text-base'>
                    <a href='#' className='font-semibold text-white'>
                      Shop the sale
                      <span aria-hidden='true'> &rarr;</span>
                    </a>
                  </div>
                </div>

                <div className='absolute -top-32 left-1/2 -translate-x-1/2 transform sm:top-6 sm:translate-x-0'>
                  <div className='ml-24 flex min-w-max space-x-6 sm:ml-3 lg:space-x-8'>
                    <div className='flex space-x-6 sm:flex-col sm:space-x-0 sm:space-y-6 lg:space-y-8'>
                      <div className='flex-shrink-0'>
                        <Image
                          className='h-64 w-64 rounded-lg object-cover md:h-72 md:w-72'
                          src='https://tailwindui.com/img/ecommerce-images/home-page-03-category-01.jpg'
                          alt=''
                          width={640}
                          height={640}
                        />
                      </div>

                      <div className='mt-6 flex-shrink-0 sm:mt-0'>
                        <Image
                          className='h-64 w-64 rounded-lg object-cover md:h-72 md:w-72'
                          src='https://tailwindui.com/img/ecommerce-images/home-page-03-category-02.jpg'
                          alt=''
                          width={640}
                          height={640}
                        />
                      </div>
                    </div>
                    <div className='flex space-x-6 sm:-mt-20 sm:flex-col sm:space-x-0 sm:space-y-6 lg:space-y-8'>
                      <div className='flex-shrink-0'>
                        <Image
                          className='h-64 w-64 rounded-lg object-cover md:h-72 md:w-72'
                          src='https://tailwindui.com/img/ecommerce-images/home-page-03-favorite-01.jpg'
                          alt=''
                          width={640}
                          height={640}
                        />
                      </div>

                      <div className='mt-6 flex-shrink-0 sm:mt-0'>
                        <Image
                          className='h-64 w-64 rounded-lg object-cover md:h-72 md:w-72'
                          src='https://tailwindui.com/img/ecommerce-images/home-page-03-favorite-02.jpg'
                          alt=''
                          width={640}
                          height={640}
                        />
                      </div>
                    </div>
                    <div className='flex space-x-6 sm:flex-col sm:space-x-0 sm:space-y-6 lg:space-y-8'>
                      <div className='flex-shrink-0'>
                        <Image
                          className='h-64 w-64 rounded-lg object-cover md:h-72 md:w-72'
                          src='https://tailwindui.com/img/ecommerce-images/home-page-03-category-01.jpg'
                          alt=''
                          width={640}
                          height={640}
                        />
                      </div>

                      <div className='mt-6 flex-shrink-0 sm:mt-0'>
                        <Image
                          className='h-64 w-64 rounded-lg object-cover md:h-72 md:w-72'
                          src='https://tailwindui.com/img/ecommerce-images/home-page-03-category-02.jpg'
                          alt=''
                          width={640}
                          height={640}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default Home
