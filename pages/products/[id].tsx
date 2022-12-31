import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import Image from 'next/image'

import Layout from '../../components/General/Layout'
import Tag from '../../components/General/Tag'
import Toast from '../../components/General/Toast'
import SingleProduct from '../../components/Product/SingleProduct'
import { Map } from '../../components/Map'

import { Coffee } from '../../types'
import ProductConfigurator from '../../components/Product/ProductConfigurator/ProductConfigurator'
import { GetServerSideProps } from 'next'

type PositionStackAPIResponse = {
  data: {
    latitude: number
    longitude: number
  }[]
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { id } = params as { id: string }

  const productRes = await fetch(`http://product-service:8080/coffee/${id}`)
  const productData: Coffee = await productRes.json()

  const locationRes = await fetch(
    `http://api.positionstack.com/v1/forward?access_key=${
      process.env.POSITIONSTACK_API_KEY
    }&query=${encodeURIComponent(productData.location)}&limit=1`
  )
  const locationData: PositionStackAPIResponse = await locationRes.json()

  return {
    props: {
      latLng: [locationData.data[0].latitude, locationData.data[0].longitude],
      product: productData
    }
  }
}

const ProductPage = ({ latLng, product }: { latLng?: [number, number]; product: Coffee }) => {
  const relatedProductsQueryFunction = async (): Promise<Coffee[]> => {
    return fetch(`/api/product-service/coffee`)
      .then(res => res.json())
      .catch(err => Promise.reject(err))
  }

  const { data: relatedProducts } = useQuery({
    queryKey: ['relatedProducts'],
    queryFn: relatedProductsQueryFunction
  })

  const [showToast, setShowToast] = useState(false)

  return (
    <>
      {product && (
        <Layout>
          <section className='relative my-8 flex flex-col gap-2 lg:flex-row'>
            <div className='flex flex-1 flex-col rounded-md border border-zinc-200 bg-gray-50 py-8 md:flex-row lg:flex-col xl:flex-row xl:py-0'>
              <div className='mx-4 mb-4 flex max-w-[256px] items-center xl:mb-0 xl:max-w-xs'>
                <Image
                  src={product.imageUrl}
                  width={400}
                  height={400}
                  alt={`${product.name} product photo`}
                  className='rounded-2xl bg-amber-50 shadow-sm'
                />
              </div>
              <div className='flex max-w-xl flex-col justify-center px-4 xl:px-8'>
                <h1 className='md:text-3xl xl:text-4xl'>{product.name}</h1>
                <div className='flex flex-wrap divide-x divide-dotted pt-2'>
                  {product.flavorNotes.map(flavorNote => (
                    <span className='px-1 text-sm font-semibold text-gray-600' key={flavorNote.id}>
                      {flavorNote.flavorNote}
                    </span>
                  ))}
                </div>
                <p className='large-text max-w-2xl pt-2'>{product.description}</p>
                <div className='flex gap-x-1 pt-2'>
                  <Tag content={`Roast level: ${product.roastLevel.toString()}`} />
                  <Tag content={product.flavor} />
                </div>
              </div>
            </div>
            <ProductConfigurator product={product} onShowToast={() => setShowToast(true)} />
          </section>

          {product?.roasterNotes && (
            <section className='mx-auto max-w-5xl pt-12'>
              <h2 className='pb-4'>Taste profile</h2>
              <hr />
              <p className='pt-4'>{product.roasterNotes}</p>
            </section>
          )}

          {latLng && (
            <section className='isolate mx-auto max-w-5xl overflow-hidden pt-12'>
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
                  .filter(relatedProduct => relatedProduct.id !== product.id)
                  .slice(0, 3)
                  .map((product: Coffee) => (
                    <SingleProduct key={product.id} product={product} />
                  ))}
              </div>
            </section>
          )}
          {showToast && (
            <Toast
              onFinished={() => setShowToast(false)}
              title='Success'
              description='Item added to cart'
            />
          )}
        </Layout>
      )}
    </>
  )
}

export default ProductPage
