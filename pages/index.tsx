import { useEffect, useReducer } from 'react'
import { useQuery } from '@tanstack/react-query'

import { Layout, PageLoader } from '../components/General'
import { SingleProduct } from '../components/Product'
import {
  MobileFilterMenu,
  FilterMenu,
  ShopHeader,
  EmptyStatePlaceholder,
  Searchbar,
  SortingDropdown,
  ClearFiltersButton
} from '../components/Shop'

import {
  sortFilterOptions,
  getFilterOptions,
  getMaxFilterValue,
  getMinFilterValue,
  filterProducts,
  searchProducts,
  sortProducts
} from '../helpers/shop'

import { Coffee, ShopState, ShopAction } from '../types'
import { FILTER_OPTIONS, INITIAL_SHOP_STATE, SORTING_OPTIONS } from '../constants/shop'

const shopPageReducer = (state: ShopState, action: ShopAction): ShopState => {
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
          sorting: SORTING_OPTIONS[0]
        }
      }

    case 'UPDATE_RANGE_FILTER':
      // Find the index of the filter in the selected filters array
      const rangeFilterId = action.payload.id
      const rangeFilterIndex = state.queryState.filters.findIndex(
        filter => filter.id === rangeFilterId
      )

      // If the filter is not already selected, add it to the selected filters array
      if (rangeFilterIndex === -1) {
        const filter = state.availableFilters.find(filter => filter.id === rangeFilterId)

        // If the filter exists in the available filters array, add it to the selected filters array
        if (filter?.type !== 'range') {
          // If the filter is not a range, do not add it to the selected filters array
          return {
            ...state
          }
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
                  min: action.payload.min,
                  max: action.payload.max
                }
              ]
            }
          }
        }
      } else {
        if (state.queryState.filters[rangeFilterIndex].type === 'range') {
          return {
            ...state,
            queryState: {
              ...state.queryState,
              filters: [
                ...state.queryState.filters.filter(filter => filter.id !== rangeFilterId),
                {
                  id: state.queryState.filters[rangeFilterIndex].id,
                  type: state.queryState.filters[rangeFilterIndex].type as 'range',
                  min: action.payload.min,
                  max: action.payload.max
                }
              ]
            }
          }
        } else {
          return {
            ...state
          }
        }
      }

    case 'UPDATE_CHECKBOX_FILTER':
      // Find the index of the filter in the selected filters array
      const filterId = action.payload.id
      const filterIndex = state.queryState.filters.findIndex(filter => filter.id === filterId)

      // If the filter is not already selected, add it to the selected filters array
      if (filterIndex === -1) {
        const filter = state.availableFilters.find(filter => filter.id === filterId)

        // If the filter exists in the available filters array, add it to the selected filters array
        if (filter?.type !== 'checkbox') {
          // If the filter is not a checkbox, do not add it to the selected filters array
          return {
            ...state
          }
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
                  values: [action.payload.value]
                }
              ]
            }
          }
        }
      } else {
        // If the filter is already selected, adjust the selected options based on the option that was clicked
        const safeFilterClone = structuredClone(state.queryState.filters[filterIndex])

        if (safeFilterClone.type !== 'checkbox') {
          return {
            ...state
          }
        }

        const filterValue = action.payload.value
        const hasValue = safeFilterClone.values.includes(filterValue)

        if (safeFilterClone.values.length === 1 && hasValue) {
          return {
            ...state,
            queryState: {
              ...state.queryState,
              filters: state.queryState.filters.filter(filter => filter.id !== filterId)
            }
          }
        } else if (hasValue) {
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

    default:
      return state
  }
}

const productFetcher = async (): Promise<Coffee[]> =>
  fetch(`/api/product-service/coffee`).then(res => res.json())

const ShopHome = () => {
  const [shopState, dispatch] = useReducer(shopPageReducer, INITIAL_SHOP_STATE)
  const { data: products, isLoading, isError, isSuccess } = useQuery(['products'], productFetcher)

  useEffect(() => {
    if (isLoading || isError) {
      return
    }

    const availableFilters = FILTER_OPTIONS.map(filter => {
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
  }, [products, isError, isLoading])

  useEffect(() => {
    if (!products) {
      return
    }
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
  }, [shopState.queryState, products])

  // Since 'name-alpha' is the default sorting value, we can check if the sorting value is different from 'name-alpha' to determine if filters are applied
  const hasFiltersApplied =
    shopState.queryState.filters.length > 0 ||
    shopState.queryState.searchQuery !== '' ||
    shopState.queryState.sorting.value !== 'name-alpha'

  return (
    <Layout>
      <MobileFilterMenu
        filters={shopState.availableFilters}
        currentFilters={shopState.queryState.filters}
        mobileFiltersOpen={shopState.mobileFiltersOpen}
        setMobileFiltersOpen={() => {
          dispatch({ type: 'SET_MOBILE_FILTERS_OPEN', payload: !shopState.mobileFiltersOpen })
        }}
        onFilterChangeFuncs={{
          onCheckboxFilterChange: (e, id) =>
            dispatch({
              type: 'UPDATE_CHECKBOX_FILTER',
              payload: {
                id,
                value: e.target.value
              }
            }),
          onRangeFilterChange: (min, max, id) =>
            dispatch({
              type: 'UPDATE_RANGE_FILTER',
              payload: {
                id,
                min,
                max
              }
            })
        }}
      />
      <ShopHeader />
      <div className='flex flex-col justify-between gap-2 pt-8 sm:flex-row'>
        <Searchbar
          onChange={e => dispatch({ type: 'UPDATE_SEARCH_QUERY', payload: e.target.value })}
          value={shopState.queryState.searchQuery}
        />
        <SortingDropdown
          selectedOption={shopState.queryState.sorting}
          sortingOptions={SORTING_OPTIONS}
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
          filters={shopState.availableFilters}
          currentFilters={shopState.queryState.filters}
          onFilterChangeFuncs={{
            onCheckboxFilterChange: (e, id) =>
              dispatch({
                type: 'UPDATE_CHECKBOX_FILTER',
                payload: {
                  id,
                  value: e.target.value
                }
              }),

            onRangeFilterChange: (min, max, id) =>
              dispatch({
                type: 'UPDATE_RANGE_FILTER',
                payload: {
                  id,
                  min,
                  max
                }
              })
          }}
          setMobileFiltersOpen={() =>
            dispatch({ type: 'SET_MOBILE_FILTERS_OPEN', payload: !shopState.mobileFiltersOpen })
          }
        />
        <section
          aria-labelledby='product-heading'
          className='mt-6 lg:col-span-2 lg:mt-0 xl:col-span-3'>
          <h2 id='product-heading' className='sr-only'>
            Products
          </h2>
          {isLoading && <PageLoader />}
          {isError && (
            <EmptyStatePlaceholder
              content={{
                title: 'Something went wrong',
                description: 'Please try again later.'
              }}
              colors={{
                container: 'bg-red-50',
                icon: 'text-red-400',
                iconBackground: 'bg-red-100'
              }}
            />
          )}
          {isSuccess && shopState.filteredProducts?.length === 0 && (
            <EmptyStatePlaceholder
              content={{
                title: 'No products found',
                description: 'Try adjusting your filters or search query.'
              }}
            />
          )}
          {isSuccess && shopState.filteredProducts && (
            <ul
              className='grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:gap-x-8 xl:grid-cols-3'
              id='product-gallery'>
              {shopState.filteredProducts.map(product => (
                <SingleProduct product={product} key={product.id} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </Layout>
  )
}

export default ShopHome
