import { CheckboxFilter, RangeFilter } from '@/components/Shop/Filters'
import { ProductFilter, SelectedFilterOptions } from '@/types'
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { ChangeEvent, Fragment } from 'react'

const MobileFilterMenu = ({
	filters,
	mobileFiltersOpen,
	currentFilters,
	setMobileFiltersOpen,
	onFilterChangeFuncs
}: {
	filters: ProductFilter[]
	mobileFiltersOpen: boolean
	currentFilters: SelectedFilterOptions[]
	setMobileFiltersOpen: (open: boolean) => void
	onFilterChangeFuncs: {
		onCheckboxFilterChange: (e: ChangeEvent<HTMLInputElement>, filterId: string) => void
		onRangeFilterChange: (min: number, max: number, filterId: string) => void
	}
}) => {
	return (
		<Transition
			show={mobileFiltersOpen}
			as={Fragment}>
			<Dialog
				as='div'
				className='relative z-40 lg:hidden'
				onClose={setMobileFiltersOpen}>
				<TransitionChild
					as={Fragment}
					enter='transition-opacity ease-linear duration-300'
					enterFrom='opacity-0'
					enterTo='opacity-100'
					leave='transition-opacity ease-linear duration-300'
					leaveFrom='opacity-100'
					leaveTo='opacity-0'>
					<div className='bg-opacity-25 fixed inset-0 bg-black' />
				</TransitionChild>

				<div className='fixed inset-0 z-40 flex'>
					<TransitionChild
						as={Fragment}
						enter='transition ease-in-out duration-300 transform'
						enterFrom='translate-x-full'
						enterTo='translate-x-0'
						leave='transition ease-in-out duration-300 transform'
						leaveFrom='translate-x-0'
						leaveTo='translate-x-full'>
						<DialogPanel className='relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-6 shadow-xl'>
							<div className='flex items-center justify-between px-4'>
								<h2 className='text-2xl font-medium text-gray-900 underline decoration-amber-300'>
									Filters
								</h2>
								<button
									type='button'
									className='-mr-2 flex h-10 w-10 items-center justify-center p-2 text-gray-400 hover:text-gray-500'
									onClick={() => setMobileFiltersOpen(false)}>
									<span className='sr-only'>Close menu</span>
									<XMarkIcon
										className='h-6 w-6'
										aria-hidden='true'
									/>
								</button>
							</div>

							{/* Filters */}
							<form className='mt-4 px-4'>
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
											const currentRange = currentFilters.find((f) => f.id === filter.id)

											// if the range filter exists in the current filters, use its values as the currentValues
											if (currentRange?.type === 'range') {
												return (
													<RangeFilter
														filter={filter}
														onFilterChange={onFilterChangeFuncs.onRangeFilterChange}
														key={filter.id}
													/>
												)
											}
									}
								})}
							</form>
						</DialogPanel>
					</TransitionChild>
				</div>
			</Dialog>
		</Transition>
	)
}

export default MobileFilterMenu
