import { ChangeEvent } from 'react'
import { PlusIcon } from '@heroicons/react/20/solid'
import { CheckboxFilter, RangeFilter } from './Filters'

import { ProductFilter, SelectedFilterOptions } from '../../types'

const FilterMenu = ({
  filters,
  currentFilters,
  setMobileFiltersOpen,
  onFilterChange
}: {
  filters: ProductFilter[]
  currentFilters: SelectedFilterOptions[]
  setMobileFiltersOpen: (open: boolean) => void
  onFilterChange: (e: ChangeEvent<HTMLInputElement>, filterId: string) => void
}) => {
  return (
    <aside>
      <h2 className='sr-only'>Filters</h2>

      <button
        type='button'
        className='inline-flex items-center lg:hidden'
        onClick={() => setMobileFiltersOpen(true)}>
        <span className='text-sm font-medium text-gray-700'>Filters</span>
        <PlusIcon className='ml-1 h-5 w-5 flex-shrink-0 text-gray-400' aria-hidden='true' />
      </button>

      <div className='hidden lg:block'>
        <form className='space-y-6 divide-y divide-gray-200'>
          {filters.map((filter, sectionIdx) => {
            switch (filter.type) {
              case 'checkbox':
                const currentValues =
                  currentFilters.find(f => f.id === filter.id)?.type === 'checkbox' &&
                  currentFilters.find(f => f.id === filter.id)?.values

                return (
                  <CheckboxFilter
                    filter={filter}
                    currentValues={currentValues || []}
                    onFilterChange={onFilterChange}
                    sectionIdx={sectionIdx}
                    key={filter.id}
                  />
                )
              case 'range':
                return (
                  <RangeFilter
                    filter={filter}
                    onFilterChange={onFilterChange}
                    key={filter.id}
                    // currentLower={currentFilters.find(f => f.id === filter.id)?.lower}
                    // currentUpper={currentFilters}
                  />
                )

              default:
                return null
            }
          })}
        </form>
      </div>
    </aside>
  )
}

export default FilterMenu
