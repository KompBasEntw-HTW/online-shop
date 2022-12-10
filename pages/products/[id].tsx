import { useRouter } from 'next/router'
import Image from 'next/image'
import { CoffeeProductData } from '../../types'
import Layout from '../../components/General/Layout'
import PageLoader from '../../components/General/PageLoader'
import { useQuery } from '@tanstack/react-query'
import Tag from '../../components/General/Tag'
import { ShoppingCartIcon } from '@heroicons/react/20/solid'
import SingleProduct from '../../components/Product/SingleProduct'
import { Map } from '../../components/Map'
import { useEffect, useState } from 'react'

const ProductPage = () => {
  const router = useRouter()
  const { id } = router.query
  const [latLng, setLatLng] = useState<[number, number] | null>(null)

  const productQueryFunction = async (id: string) => {
    return fetch(`/api/product-service/coffee/${id}`)
      .then(res => res.json())
      .catch(err => Promise.reject(err))
  }

  const relatedProductsQueryFunction = async () => {
    return fetch(`/api/product-service/coffee`)
      .then(res => res.json())
      .catch(err => Promise.reject(err))
  }

  const {
    data: product,
    isLoading,
    isError
  } = useQuery({
    queryKey: ['products', id],
    queryFn: () => productQueryFunction(id as string)
  })

  const { data: relatedProducts } = useQuery({
    queryKey: ['relatedProducts'],
    queryFn: relatedProductsQueryFunction
  })

  useEffect(() => {
    const getLatLng = async (location: string) => {
      const POSITIONSTACK_API_KEY = 'bf654b2b9c6074edc7c361e6c84c9303'

      fetch(
        `http://api.positionstack.com/v1/forward?access_key=${POSITIONSTACK_API_KEY}&query=${encodeURIComponent(
          location
        )}&limit=1`
      )
        .then(res => res.json())
        .then(data => {
          setLatLng([data.data[0].latitude, data.data[0].longitude])
        })
    }

    if (product) {
      getLatLng(product.location)
    }
  }, [product])

  console.log(product, isLoading, isError)

  if (isLoading) return <PageLoader />

  const formattedPrice = product.price.toLocaleString(undefined, {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2
  })

  return (
    <>
      {product && (
        <Layout>
          <section className='relative my-8 grid grid-cols-12 rounded-md border border-zinc-200 bg-gray-50'>
            <div className='col-span-3 '>
              <div className='m-4 bg-amber-50'>
                <Image
                  src={product.imageUrl}
                  width={500}
                  height={500}
                  alt={`${product.title} product photo`}
                  className='rounded-2xl shadow-sm'
                />
              </div>
            </div>
            <div className='col-span-9 flex flex-col justify-center px-8'>
              <h1>{product.name}</h1>
              <p className='pt-1 text-base font-semibold text-gray-600 line-clamp-1'>
                {product.flavorNotes}
              </p>
              <p className='large-text max-w-2xl pt-2'>{product.description}</p>
              <div className='flex gap-x-1 pt-2'>
                <Tag content={`Roast level: ${product.roastLevel.toString()}`} />
                <Tag content={product.flavor} />
              </div>
              <div className='flex gap-x-2 pt-4'>
                <span className='font-lora text-2xl font-extrabold text-gray-900 underline decoration-amber-400'>
                  ${formattedPrice} USD
                </span>
                <span className='small-text inline-flex self-center text-gray-500'> per kilo</span>
              </div>

              <button className='absolute right-4 top-4 block flex place-items-center rounded-full bg-zinc-700 p-2 hover:bg-zinc-800'>
                <ShoppingCartIcon className='h-6 w-6 text-white' />
                <span className='sr-only'>Add to cart</span>
              </button>
            </div>
          </section>

          <section className='mx-auto max-w-5xl pt-12'>
            <h2 className='pb-4'>Taste profile</h2>
            <hr />
            <p className='pt-4'>{product.roasterNotes}</p>
          </section>

          {latLng && (
            <section className='mx-auto h-[570px] max-w-5xl overflow-hidden pt-12'>
              <h2 className='pb-4'>Origin</h2>
              <hr />
              <p className='pt-4'>
                {product.name} is roasted by <strong>{product.roaster}</strong> in{' '}
                <strong>{product.location}</strong>.
              </p>
              <Map centerPosition={latLng} className='mt-6' />
            </section>
          )}

          {relatedProducts && (
            <section className='mx-auto max-w-5xl overflow-hidden py-16'>
              <h2 className='pb-4'>Related products</h2>
              <hr />
              <div className='grid grid-cols-1 gap-4 pt-8 sm:grid-cols-2 lg:grid-cols-3'>
                {relatedProducts
                  .filter((relatedProduct: any) => relatedProduct.id !== product.id)
                  .slice(0, 3)
                  .map((product: CoffeeProductData) => (
                    <SingleProduct key={product.id} product={product} />
                  ))}
              </div>
            </section>
          )}
        </Layout>
      )}
    </>
  )
}

export default ProductPage
