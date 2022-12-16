import { XCircleIcon } from '@heroicons/react/24/solid'

const ClearFiltersButton = ({ onClearFilters }: { onClearFilters: () => void }) => {
  return (
    <button
      onClick={onClearFilters}
      className='inline-flex items-center gap-x-2 rounded-lg border bg-zinc-50 px-4 py-2 text-base text-zinc-500 hover:border-zinc-500'>
      Clear all filters
      <XCircleIcon className='h-5 w-5' />
    </button>
  )
}

export default ClearFiltersButton
