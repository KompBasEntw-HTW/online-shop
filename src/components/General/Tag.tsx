import { ReactNode } from 'react'

const Tag = ({ content, icon }: { content: string; icon?: ReactNode }) => {
	return (
		<span className='inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-900 shadow-sm shadow-amber-100'>
			{icon}
			{content}
		</span>
	)
}

export default Tag
