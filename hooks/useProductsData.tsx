import { useQuery } from '@tanstack/react-query'
import { Coffee } from '../types'

const fetchProductsData = async (): Promise<Coffee[]> =>
  fetch(`/api/product-service/coffee`).then(res => res.json())

const useProductsData = (limit?: number, blackList?: number[], whiteList?: number[]) => {
  const { data, isLoading, isError, isSuccess } = useQuery(['products'], fetchProductsData)

  let products = data
  if (limit) products = data?.slice(0, limit)

  if (blackList) {
    products = products?.filter(product => !blackList.includes(product.id))
  }

  if (whiteList) {
    products = products?.filter(product => whiteList.includes(product.id))
  }

  return { products, isLoading, isError, isSuccess }
}

export default useProductsData
