import { Tag } from '@/components/General'
import MapComponent from '@/components/Map/MapComponent'
import { ProductConfigurator, SingleProduct } from '@/components/Product'
import Image from 'next/image'

import { CartContextProvider } from '@/context/CartContext'
import { Coffee, PositionStackAPIResponse } from '@/types'

function getRandomItemsExceptId(products: Coffee[], excludeId: number, count = 3) {
	const filteredItems = products.filter((product) => product.id !== excludeId)
	for (let i = filteredItems.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		;[filteredItems[i], filteredItems[j]] = [filteredItems[j], filteredItems[i]]
	}
	return filteredItems.slice(0, count)
}

const ProductPage = async ({ params }: { params: Promise<{ id: number }> }) => {
	const id = (await params).id
	let latLng: [number, number]
	let product: Coffee
	let relatedProducts: Coffee[]
	try {
		const productsRes = await fetch(`http://product-service:8080/coffee`)
		const products: Coffee[] = await productsRes.json()
		product = products.filter((product) => product.id == id)[0]
		relatedProducts = getRandomItemsExceptId(products, id)

		// const locationRes = await fetch(
		// 	`http://api.positionstack.com/v1/forward?access_key=${process.env.POSITIONSTACK_API_KEY
		// 	}&query=${encodeURIComponent(product.location)}&limit=1`
		// )

		// const locationData: PositionStackAPIResponse = await locationRes.json()

		// latLng = [locationData?.data[0]?.latitude, locationData?.data[0]?.longitude]
	} catch (err) {
		console.log(err)
		return {
			notFound: true
		}
	}
	return (
		<>
			{product && (
				<>
					<section className='relative my-8 flex flex-col gap-2 lg:flex-row'>
						<div className='flex flex-1 flex-col rounded-md border border-zinc-200 bg-gray-50 py-8 md:flex-row lg:flex-col xl:flex-row xl:py-0'>
							<div className='mx-4 mb-4 flex max-w-[256px] items-center xl:mb-0 xl:max-w-xs'>
								<Image
									src={product.imageUrl}
									width={400}
									height={400}
									alt={`${product.name} product photo`}
									className='rounded-2xl bg-amber-50 shadow-xs'
								/>
							</div>
							<div className='flex max-w-xl flex-col justify-center px-4 xl:px-8'>
								<h1 className='md:text-3xl xl:text-4xl'>{product.name}</h1>
								<div className='flex flex-wrap divide-x divide-dotted pt-2'>
									{product.flavorNotes.map((flavorNote) => (
										<span
											className='px-1 text-sm font-semibold text-gray-600'
											key={flavorNote.id}>
											{flavorNote.flavorNote}
										</span>
									))}
								</div>
								<p
									className='large-text max-w-2xl pt-2'
									id='product-description'>
									{product.description}
								</p>
								<div className='flex gap-x-1 pt-2'>
									<Tag content={`Roast level: ${product.roastLevel.toString()}`} />
									<Tag content={product.flavor} />
								</div>
							</div>
						</div>
						<CartContextProvider>
							<ProductConfigurator product={product} />
						</CartContextProvider>
					</section>

					{product?.roasterNotes && (
						<section className='mx-auto max-w-5xl pt-12'>
							<h2 className='pb-4'>Taste profile</h2>
							<hr />
							<p className='pt-4'>{product.roasterNotes}</p>
						</section>
					)}

					{/**latLng && (
						<section className='isolate mx-auto max-w-5xl overflow-hidden pt-12'>
							<h2 className='pb-4'>Origin</h2>
							<hr />
							<p className='pt-4'>
								{product.name} is roasted by <strong>{product.roaster}</strong> in{' '}
								<strong>{product.location}</strong>.
							</p>
							<MapComponent centerPosition={latLng} className='mt-6' />
						</section>
					)**/}

					{relatedProducts && (
						<section className='mx-auto max-w-5xl overflow-hidden py-16'>
							<h2 className='pb-4'>Related products</h2>
							<hr />
							<div className='grid grid-cols-1 gap-4 pt-8 sm:grid-cols-2 lg:grid-cols-3'>
								{relatedProducts.map((product: Coffee) => (
									<SingleProduct
										key={product.id}
										product={product}
									/>
								))}
							</div>
						</section>
					)}
				</>
			)}
		</>
	)
}

export default ProductPage
