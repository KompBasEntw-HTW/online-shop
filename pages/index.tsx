import { useEffect, useReducer } from 'react'
import { useQuery } from '@tanstack/react-query'

import Layout from '../components/General/Layout'
import SingleProduct from '../components/Product/SingleProduct'
import MobileFilterMenu from '../components/Shop/MobileFilterMenu'
import FilterMenu from '../components/Shop/FilterMenu'
import ShopHeader from '../components/Shop/ShopHeader'
import PageLoader from '../components/General/PageLoader'
import EmptyShopStatePlaceholder from '../components/Shop/EmptyShopStatePlaceholder'

import {
  sortFilterOptions,
  getFilterOptions,
  getMaxFilterValue,
  getMinFilterValue,
  filterProducts,
  searchProducts
} from '../helpers/shop-helpers'

import { Coffee, SortingsOptionsType, ShopPageState, ShopPageAction } from '../types'
import Searchbar from '../components/Shop/Searchbar'
import SortingDropdown from '../components/Shop/SortingDropdown'
import ClearFiltersButton from '../components/Shop/ClearFiltersButton'

const sortingOptions: SortingsOptionsType[] = [
  { name: 'Name (Alphabetical)', value: 'name-alpha' },
  { name: 'Name (Reverse Alphabetical)', value: 'name-reverse-alpha' },
  { name: 'Price (Descending)', value: 'price-desc' },
  { name: 'Price (Ascending)', value: 'price-asc' }
]

const initialShopPageState: ShopPageState = {
  mobileFiltersOpen: false,
  availableFilters: [
    {
      id: 'roastLevel',
      name: 'Roast level',
      type: 'checkbox',
      values: []
    },
    {
      id: 'flavor',
      name: 'Flavor',
      type: 'checkbox',
      values: []
    },
    {
      id: 'flavorNotes',
      name: 'Flavor notes',
      type: 'checkbox',
      values: []
    },
    {
      id: 'price',
      name: 'Price',
      type: 'range',
      min: 0,
      max: 0,
      step: 2
    }
  ],
  queryState: {
    searchQuery: '',
    filters: [],
    sorting: sortingOptions[0]
  },
  filteredProducts: []
}

const shopPageReducer = (state: ShopPageState, action: ShopPageAction): ShopPageState => {
  switch (action.type) {
    case 'SET_MOBILE_FILTERS_OPEN':
      return { ...state, mobileFiltersOpen: action.payload }

    case 'SET_AVAILABLE_FILTERS':
      return { ...state, availableFilters: action.payload }

    case 'SET_FILTERED_PRODUCTS':
      const filteredProducts = sortProducts(
        searchProducts(
          filterProducts(action.payload, state.queryState.filters),
          state.queryState.searchQuery
        ),
        state.queryState.sorting
      )

      return { ...state, filteredProducts }

    case 'UPDATE_SEARCH_QUERY':
      return {
        ...state,
        queryState: {
          ...state.queryState,
          searchQuery: action.payload
        }
      }
    case 'UPDATE_APPLIED_SORTING':
      return {
        ...state,
        queryState: {
          ...state.queryState,
          sorting: action.payload
        }
      }

    case 'RESET_FILTERS':
      return {
        ...state,
        queryState: {
          filters: [],
          searchQuery: '',
          sorting: sortingOptions[0]
        }
      }

    case 'UPDATE_APPLIED_FILTERS':
      const filterId = action.payload.filterId

      const filterIndex = state.queryState.filters.findIndex(filter => filter.id === filterId)

      // If the filter is not already selected, add it to the selected filters array
      if (filterIndex === -1) {
        const filter = state.availableFilters.find(filter => filter.id === filterId)

        // If the filter exists in the available filters array, add it to the selected filters array
        if (filter) {
          if (filter.type === 'range') {
          } else {
            return {
              ...state,
              queryState: {
                ...state.queryState,
                filters: [
                  ...state.queryState.filters,
                  {
                    id: filter.id,
                    type: filter.type,
                    values: [action.payload.filterValue]
                  }
                ]
              }
            }
          }
        }
      } else {
        // If the filter is already selected, adjust the selected options based on the option that was clicked
        const safeFilterClone = structuredClone(state.queryState.filters[filterIndex])

        // If the filter is the price filter, update the min and max values
        if (safeFilterClone.type === 'range') {
          return {
            ...state
          }
        } else {
          // If the filter is a checkbox filter, update the values array
          const filterValue = action.payload.filterValue
          const hasValue = safeFilterClone.values.includes(filterValue)

          if (hasValue) {
            safeFilterClone.values = safeFilterClone.values.filter(value => value !== filterValue)
          } else {
            safeFilterClone.values = [...safeFilterClone.values, filterValue]
          }

          return {
            ...state,
            queryState: {
              ...state.queryState,
              filters: [
                ...state.queryState.filters.filter(filter => filter.id !== filterId),
                safeFilterClone
              ]
            }
          }
        }
      }

    default:
      return state
  }
}

const sortProducts = (products: Coffee[], sorting: SortingsOptionsType) => {
  switch (sorting.value) {
    case 'name-alpha':
      return products.sort((a, b) => a.name.localeCompare(b.name))
    case 'name-reverse-alpha':
      return products.sort((a, b) => b.name.localeCompare(a.name))
    case 'price-desc':
      return products.sort((a, b) => b.pricePerKilo - a.pricePerKilo)
    case 'price-asc':
      return products.sort((a, b) => a.pricePerKilo - b.pricePerKilo)
    default:
      return products
  }
}

const productFetcher = async (): Promise<Coffee[]> =>
  fetch(`/api/product-service/coffee`).then(res => res.json())

const ShopHome = () => {
  const [shopPageState, dispatch] = useReducer(shopPageReducer, initialShopPageState)

  const { data: products, isLoading, isError, isSuccess } = useQuery(['products'], productFetcher)

  useEffect(() => {
    if (!products) {
      return
    }

    const availableFilters = shopPageState.availableFilters.map(filter => {
      switch (filter.type) {
        case 'checkbox':
          return {
            ...filter,
            values: sortFilterOptions(getFilterOptions(products, filter))
          }
        case 'range':
          return {
            ...filter,
            min: getMinFilterValue(products),
            max: getMaxFilterValue(products)
          }
      }
    })

    // Set the filters state variable to the updated filters array
    dispatch({ type: 'SET_AVAILABLE_FILTERS', payload: availableFilters })

    // Set the filtered products state variable to the products array => this is done to have a copy of the original products array which then can be filtered
    dispatch({ type: 'SET_FILTERED_PRODUCTS', payload: products })
  }, [products])

  useEffect(() => {
    if (!products) {
      return
    }

    dispatch({
      type: 'SET_FILTERED_PRODUCTS',
      payload: products
    })
  }, [shopPageState.queryState])

  const hasFiltersApplied =
    shopPageState.queryState.filters.length > 0 ||
    shopPageState.queryState.searchQuery !== '' ||
    shopPageState.queryState.sorting.value !== 'name-alpha'

  return (
    <Layout>
      <MobileFilterMenu
        filters={shopPageState.availableFilters}
        mobileFiltersOpen={shopPageState.mobileFiltersOpen}
        setMobileFiltersOpen={() => {
          dispatch({ type: 'SET_MOBILE_FILTERS_OPEN', payload: !shopPageState.mobileFiltersOpen })
        }}
        onFilterChange={(e, filterId) =>
          dispatch({
            type: 'UPDATE_APPLIED_FILTERS',
            payload: {
              filterId,
              filterValue: e.target.value
            }
          })
        }
      />
      <ShopHeader />
      <div className='flex flex-col justify-between gap-2 pt-8 sm:flex-row'>
        <Searchbar
          onChange={e => dispatch({ type: 'UPDATE_SEARCH_QUERY', payload: e.target.value })}
          value={shopPageState.queryState.searchQuery}
        />
        <SortingDropdown
          selectedOption={shopPageState.queryState.sorting}
          sortingOptions={sortingOptions}
          onSelectOption={option => dispatch({ type: 'UPDATE_APPLIED_SORTING', payload: option })}
        />
        {hasFiltersApplied && (
          <ClearFiltersButton
            onClearFilters={() =>
              dispatch({
                type: 'RESET_FILTERS'
              })
            }
          />
        )}
      </div>
      <div className='pt-6 pb-24 lg:grid lg:grid-cols-3 lg:gap-x-8 xl:grid-cols-4'>
        <FilterMenu
          filters={shopPageState.availableFilters}
          currentFilters={shopPageState.queryState.filters}
          onFilterChange={(e, filterId) =>
            dispatch({
              type: 'UPDATE_APPLIED_FILTERS',
              payload: {
                filterId,
                filterValue: e.target.value
              }
            })
          }
          setMobileFiltersOpen={() =>
            dispatch({ type: 'SET_MOBILE_FILTERS_OPEN', payload: !shopPageState.mobileFiltersOpen })
          }
        />
        <section
          aria-labelledby='product-heading'
          className='mt-6 lg:col-span-2 lg:mt-0 xl:col-span-3'>
          <h2 id='product-heading' className='sr-only'>
            Products
          </h2>
          {isLoading && <PageLoader />}
          {isError && <EmptyShopStatePlaceholder type='error' />}
          {isSuccess && shopPageState.filteredProducts?.length === 0 && (
            <EmptyShopStatePlaceholder />
          )}
          {isSuccess && shopPageState.filteredProducts && (
            <div className='grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:gap-x-8 xl:grid-cols-3'>
              {shopPageState.filteredProducts.map(product => (
                <SingleProduct product={product} key={product.id} />
              ))}
            </div>
          )}
        </section>
      </div>
    </Layout>
  )
}

export default ShopHome
