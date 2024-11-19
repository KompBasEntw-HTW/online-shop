import { Coffee } from '@/types'
import { useQuery } from '@tanstack/react-query'

const useProductsData = (limit?: number, blackList?: number[], whiteList?: number[]) => {
	const { data, isLoading, isError, isSuccess } = useQuery({
		queryKey: ['products'],
		queryFn: async (): Promise<Coffee[]> => {
			const response = await fetch(`/api/product-service/coffee`)
			return response.json()
		}
	})

	let products = data
	if (limit) products = data?.slice(0, limit)

	if (blackList) {
		products = products?.filter((product) => !blackList.includes(product.id))
	}

	if (whiteList) {
		products = products?.filter((product) => whiteList.includes(product.id))
	}

	return { products, isLoading, isError, isSuccess }
}

export default useProductsData
