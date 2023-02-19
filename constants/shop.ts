import { SortingsOptionsType, ProductFilter, ShopState } from '../types'

export const SORTING_OPTIONS: SortingsOptionsType[] = [
  { name: 'Name (Alphabetical)', value: 'name-alpha' },
  { name: 'Name (Reverse Alphabetical)', value: 'name-reverse-alpha' },
  { name: 'Price (Descending)', value: 'price-desc' },
  { name: 'Price (Ascending)', value: 'price-asc' }
]

export const FILTER_OPTIONS: ProductFilter[] = [
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
    max: 20
  }
]

export const INITIAL_SHOP_STATE: ShopState = {
  mobileFiltersOpen: false,
  availableFilters: [],
  queryState: {
    searchQuery: '',
    filters: [],
    sorting: SORTING_OPTIONS[0]
  },
  filteredProducts: []
}
