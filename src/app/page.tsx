import { Coffee } from '@/types'
import ShopHome from './page-component'
export const dynamic = 'force-dynamic'
export default async function Page() {
	const response = await fetch(`http://product-service:8080/coffee`)
	const products: Coffee[] = await response.json()
	return <ShopHome products={products} />
}
