import { Transition, Dialog } from '@headlessui/react'
import { Fragment, ChangeEvent } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { CheckboxFilter, RangeFilter } from './Filters'
import { ProductFilter, SelectedFilterOptions } from '../../types'

const MobileFilterMenu = ({
  filters,
  mobileFiltersOpen,
  currentFilters,
  setMobileFiltersOpen,
  onFilterChange
}: {
  filters: ProductFilter[]
  mobileFiltersOpen: boolean
  currentFilters: SelectedFilterOptions[]
  setMobileFiltersOpen: (open: boolean) => void
  onFilterChange: (e: ChangeEvent<HTMLInputElement>, filterId: string) => void
}) => {
  return (
    <Transition.Root show={mobileFiltersOpen} as={Fragment}>
      <Dialog as='div' className='relative z-40 lg:hidden' onClose={setMobileFiltersOpen}>
        <Transition.Child
          as={Fragment}
          enter='transition-opacity ease-linear duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='transition-opacity ease-linear duration-300'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'>
          <div className='fixed inset-0 bg-black bg-opacity-25' />
        </Transition.Child>

        <div className='fixed inset-0 z-40 flex'>
          <Transition.Child
            as={Fragment}
            enter='transition ease-in-out duration-300 transform'
            enterFrom='translate-x-full'
            enterTo='translate-x-0'
            leave='transition ease-in-out duration-300 transform'
            leaveFrom='translate-x-0'
            leaveTo='translate-x-full'>
            <Dialog.Panel className='relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-6 shadow-xl'>
              <div className='flex items-center justify-between px-4'>
                <h2 className='text-2xl font-medium text-gray-900 underline decoration-amber-300'>
                  Filters
                </h2>
                <button
                  type='button'
                  className='-mr-2 flex h-10 w-10 items-center justify-center p-2 text-gray-400 hover:text-gray-500'
                  onClick={() => setMobileFiltersOpen(false)}>
                  <span className='sr-only'>Close menu</span>
                  <XMarkIcon className='h-6 w-6' aria-hidden='true' />
                </button>
              </div>

              {/* Filters */}
              <form className='mt-4 px-4'>
                {filters.map((filter, sectionIdx) => {
                  switch (filter.type) {
                    case 'checkbox':
                      return (
                        <CheckboxFilter
                          filter={filter}
                          onFilterChange={onFilterChange}
                          // currentValues={}
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
                        />
                      )

                    default:
                      return null
                  }
                })}
              </form>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default MobileFilterMenu
