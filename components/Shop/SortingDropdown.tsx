import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import clsx from 'clsx'
import { SortingsOptionsType } from '../../types'

const SortingDropdown = ({
  selectedOption,
  onSelectOption,
  sortingOptions
}: {
  selectedOption: SortingsOptionsType | undefined
  onSelectOption: (option: SortingsOptionsType) => void
  sortingOptions: SortingsOptionsType[]
}) => {
  return (
    <Menu as='div' className='relative inline-block text-left'>
      <div>
        <Menu.Button className='inline-flex w-full justify-center rounded-lg border px-4 py-2 text-base text-zinc-500 hover:border-zinc-500 focus:outline-none'>
          {selectedOption?.name || 'Sort by'}
          <ChevronDownIcon className='-mr-1 ml-2 h-5 w-5' aria-hidden='true' />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter='transition ease-out duration-100'
        enterFrom='transform opacity-0 scale-95'
        enterTo='transform opacity-100 scale-100'
        leave='transition ease-in duration-75'
        leaveFrom='transform opacity-100 scale-100'
        leaveTo='transform opacity-0 scale-95'>
        <Menu.Items className='absolute right-0 z-10 mt-2 w-56 origin-top-right overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
          {sortingOptions.map(option => (
            <Menu.Item key={option.value}>
              {({ active }) => (
                <button
                  className={clsx(
                    active ? ' bg-amber-600 text-white' : 'text-zinc-500',
                    'block w-full px-4 py-2 text-left text-sm'
                  )}
                  onClick={() => onSelectOption(option)}>
                  {option.name}
                </button>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

export default SortingDropdown
