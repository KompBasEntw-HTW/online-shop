import { useState, useEffect } from 'react'
import Layout from '../components/General/Layout'
import SingleProduct from '../components/Product/SingleProduct'
import { CoffeeProductData, FilterOption, ProductFilter } from '../types'
import MobileFilterMenu from '../components/Shop/MoibleFilterMenu'
import FilterMenu from '../components/Shop/FilterMenu'
import ShopHeader from '../components/Shop/ShopHeader'
const filters: ProductFilter[] = [
  {
    id: 'roastLevel',
    name: 'Roast level',
    options: []
  },
  {
    id: 'flavor',
    name: 'Flavor',
    options: []
  },
  {
    id: 'flavorNotes',
    name: 'Flavor notes',
    options: []
  }
]

const ShopHome = () => {
  const [products, setProducts] = useState<CoffeeProductData[]>([])
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [availableFilters, setAvailableFilters] = useState<ProductFilter[]>([])
  const [selectedFilters, setSelectedFilters] = useState<ProductFilter[]>([])
  const [filteredProducts, setFilteredProducts] = useState<CoffeeProductData[]>([])

  useEffect(() => {
    const fetchProducts = async () => {
      fetch(`/api/product-service/coffee`)
        .then(res => res.json())
        .then(data => setProducts(data))
        .catch(err => console.log(err))
    }

    fetchProducts()
  }, [])

  useEffect(() => {
    const availableFilters = filters.map(filter => {
      // Use the reduce method to extract the values from the coffee objects and add them to the options array
      filter.options = products
        .reduce<FilterOption[]>((options, product) => {
          // Check if the product object has a property with the same ID as the filter
          if (product.hasOwnProperty(filter.id)) {
            // If it does, extract the value of that property
            const id = filter.id as keyof CoffeeProductData

            const option = {
              value: product[id].toString(),
              name: product[id].toString()
            }

            options.push(option)
          }
          return options
        }, [])
        .filter((option, index, self) => {
          // Use the filter method to remove duplicate options
          return self.findIndex(o => o.value === option.value) === index
        })

      return filter
    })

    // Sort the options alphabetically
    availableFilters.forEach(filter => {
      filter.options.sort((a, b) => {
        if (a.name < b.name) {
          return -1
        }
        if (a.name > b.name) {
          return 1
        }
        return 0
      })
    })

    // Set the filters state variable to the updated filters array
    setAvailableFilters(availableFilters)
  }, [products])

  console.log(products, availableFilters)

  return (
    <Layout>
      <MobileFilterMenu
        filters={filters}
        mobileFiltersOpen={mobileFiltersOpen}
        setMobileFiltersOpen={setMobileFiltersOpen}
      />
      <ShopHeader />
      <div className='pt-12 pb-24 lg:grid lg:grid-cols-3 lg:gap-x-8 xl:grid-cols-4'>
        <FilterMenu
          filters={filters}
          onFilterChange={() => ({})}
          setMobileFiltersOpen={setMobileFiltersOpen}
        />
        <section
          aria-labelledby='product-heading'
          className='mt-6 lg:col-span-2 lg:mt-0 xl:col-span-3'>
          <h2 id='product-heading' className='sr-only'>
            Products
          </h2>
          <div className='grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:gap-x-8 xl:grid-cols-3'>
            {products.map(product => (
              <SingleProduct product={product} key={product.id} />
            ))}
          </div>
        </section>
      </div>
    </Layout>
  )
}

export default ShopHome
