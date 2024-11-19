import { CheckboxFilter, RangeFilter } from '@/components/Shop/Filters'
import { PlusIcon } from '@heroicons/react/20/solid'
import { ChangeEvent } from 'react'

import { ProductFilter, SelectedFilterOptions } from '@/types'

const FilterMenu = ({
	filters,
	currentFilters,
	setMobileFiltersOpen,
	onFilterChangeFuncs
}: {
	filters: ProductFilter[]
	currentFilters: SelectedFilterOptions[]
	setMobileFiltersOpen: (open: boolean) => void
	onFilterChangeFuncs: {
		onCheckboxFilterChange: (e: ChangeEvent<HTMLInputElement>, filterId: string) => void
		onRangeFilterChange: (min: number, max: number, filterId: string) => void
	}
}) => {
	return (
		<aside>
			<h2 className='sr-only'>Filters</h2>

			<button
				type='button'
				className='inline-flex items-center lg:hidden'
				onClick={() => setMobileFiltersOpen(true)}>
				<span className='text-sm font-medium text-gray-700'>Filters</span>
				<PlusIcon
					className='ml-1 h-5 w-5 flex-shrink-0 text-gray-400'
					aria-hidden='true'
				/>
			</button>

			<div className='hidden lg:block'>
				<form
					className='space-y-6 divide-y divide-gray-200'
					id='filter-form'>
					{filters.map((filter, sectionIdx) => {
						switch (filter.type) {
							case 'checkbox':
								const currentValues: string[] = []
								const current = currentFilters.find((f) => f.id === filter.id)

								// If filter has been used before, use the current values
								if (current?.type === 'checkbox') {
									currentValues.push(...current.values)
								}

								return (
									<CheckboxFilter
										filter={filter}
										onFilterChange={onFilterChangeFuncs.onCheckboxFilterChange}
										currentValues={currentValues}
										sectionIdx={sectionIdx}
										key={filter.id}
									/>
								)
							case 'range':
								return (
									<RangeFilter
										filter={filter}
										onFilterChange={onFilterChangeFuncs.onRangeFilterChange}
										key={filter.id}
									/>
								)
						}
					})}
				</form>
			</div>
		</aside>
	)
}

export default FilterMenu
