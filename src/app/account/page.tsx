import { auth, signIn, signOut } from '@/auth'
import SingleOrder from '@/components/Account/SingleOrder'
import { EmptyStatePlaceholder } from '@/components/Shop'
import { Coffee, Order, OrderWithProductsData } from '@/types'

const Account = async () => {
	const session = await auth()

	const orderResponse = await fetch('http://checkout-service:8080/orders', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + session?.accessToken
		}
	})

	let orders: Order[] = []

	try {
		orders = await orderResponse.json()
	} catch {
		console.log('No Orders yet')
	}

	const productResponse = await fetch('http://product-service:8080/coffee')

	const products: Coffee[] = await productResponse.json()

	let transformedOrders: OrderWithProductsData[] | undefined

	if (orders && products) {
		transformedOrders = orders?.map((order) => {
			const associatedProducts = order.orderItems?.map((orderItem) => {
				const associatedProduct = products?.find(
					(product) => product.id === orderItem.item.productId
				)
				const selectedBagSize = associatedProduct?.coffeeBagSizes?.find(
					(bagSize) =>
						orderItem.item.productId === associatedProduct.id &&
						bagSize.bagSize.id === orderItem.item.bagSizeId
				)
				return {
					id: orderItem.id,
					quantity: orderItem.quantity,
					...associatedProduct,
					selectedBagSize: selectedBagSize
				}
			})

			return {
				...order,
				orderItems: associatedProducts
			}
		}) as OrderWithProductsData[]
	}

	if (session) {
		return (
			<>
				<section className='py-12'>
					<div className='flex content-center justify-between'>
						<h1>Account</h1>
						<form
							action={async () => {
								'use server'
								await signOut()
							}}>
							<button
								type='submit'
								className='rounded-md border border-amber-100 bg-amber-100 px-4 py-1 font-semibold text-amber-600 hover:border-amber-600'>
								Sign Out
							</button>
						</form>
					</div>
					<div className='flex flex-col pt-4'>
						<span className='text-lg font-semibold'>{session?.user?.name}</span>
						<span className='text-sm text-gray-500'>{session?.user?.email}</span>
					</div>
				</section>
				<section className='py-12'>
					<h2>Your Orders</h2>
					{orders?.length === 0 ? (
						<EmptyStatePlaceholder
							content={{
								title: 'No orders found',
								description: 'You have not placed any orders yet.'
							}}
							className='mt-4'
						/>
					) : (
						<div className='flex flex-col gap-y-2 pt-4'>
							{transformedOrders?.map((order, idx) => {
								if (order)
									return (
										<SingleOrder
											order={order}
											key={idx}
										/>
									)
							})}
						</div>
					)}
				</section>
			</>
		)
	}

	return (
		<>
			<section className='flex h-[70vh] flex-col items-center justify-center py-12 text-center'>
				<h1>You&#39;re not currently logged in</h1>
				<p className='pt-2 text-lg'>
					You need to be signed in to view this page. You can sign in by clicking the button below.
				</p>
				<div className='pt-4'>
					<form
						action={async () => {
							'use server'
							await signIn('keycloak', { redirectTo: '/account' })
						}}>
						<button
							type='submit'
							className='rounded-md border border-amber-100 bg-amber-100 px-4 py-1 font-semibold text-amber-600 hover:border-amber-600'>
							<span>Sign in</span>
						</button>
					</form>
				</div>
			</section>
		</>
	)
}

export default Account
