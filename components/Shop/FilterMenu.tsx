import { PlusIcon } from '@heroicons/react/20/solid'
import { ChangeEvent } from 'react'
import { ProductFilter } from '../../types'

const FilterMenu = ({
  filters,
  setMobileFiltersOpen,
  onFilterChange
}: {
  filters: ProductFilter[]
  setMobileFiltersOpen: (open: boolean) => void
  onFilterChange: (e: ChangeEvent<HTMLInputElement>) => void
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
        <form className='space-y-10 divide-y divide-gray-200'>
          {filters.map((section, sectionIdx) => (
            <div key={section.name} className={sectionIdx === 0 ? '' : 'pt-6'}>
              <fieldset>
                <legend className='block font-lora text-lg font-bold text-gray-900'>
                  {section.name}
                </legend>
                <div className='space-y-2 pt-3'>
                  {section.options.map((option, optionIdx) => (
                    <div key={option.value} className='flex items-center'>
                      <input
                        id={`${section.id}-${optionIdx}`}
                        name={section.id}
                        defaultValue={option.value}
                        type='checkbox'
                        className='h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500'
                        onChange={e => onFilterChange(e)}
                      />
                      <label
                        htmlFor={`${section.id}-${optionIdx}`}
                        className='ml-3 text-sm text-gray-600'>
                        {option.name}
                      </label>
                    </div>
                  ))}
                </div>
              </fieldset>
            </div>
          ))}
        </form>
      </div>
    </aside>
  )
}

export default FilterMenu
