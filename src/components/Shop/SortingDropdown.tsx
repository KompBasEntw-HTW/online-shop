import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { Fragment } from 'react'
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
		<Menu
			as='div'
			className='relative inline-block text-left'
			id='sorting-dropdown'>
			<MenuButton
				className='inline-flex w-full basis-96 content-center items-center rounded-lg border px-4 py-2 text-base text-zinc-500 hover:border-zinc-500 focus:outline-hidden'
				id='sorting-dropdown-button'>
				{selectedOption?.name || 'Sort by'}
				<ChevronDownIcon
					className='-mr-1 ml-2 h-5 w-5'
					aria-hidden='true'
				/>
			</MenuButton>
			<Transition
				as={Fragment}
				enter='transition ease-out duration-100'
				enterFrom='transform opacity-0 scale-95'
				enterTo='transform opacity-100 scale-100'
				leave='transition ease-in duration-75'
				leaveFrom='transform opacity-100 scale-100'
				leaveTo='transform opacity-0 scale-95'>
				<MenuItems
					className='absolute right-0 z-10 mt-2 w-56 origin-top-right overflow-hidden rounded-md bg-white ring-1 shadow-lg ring-black/5 focus:outline-hidden'
					id='sorting-dropdown-items'>
					{sortingOptions.map((option) => (
						<MenuItem
							key={option.value}
							className='block w-full px-4 py-2 text-left text-sm text-zinc-500 data-focus:bg-amber-600 data-focus:text-white'>
							<button onClick={() => onSelectOption(option)}>{option.name}</button>
						</MenuItem>
					))}
				</MenuItems>
			</Transition>
		</Menu>
	)
}

export default SortingDropdown
