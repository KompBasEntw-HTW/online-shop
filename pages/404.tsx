import Layout from '../components/General/Layout'
import Link from 'next/link'
import { SparklesIcon } from '@heroicons/react/20/solid'

const ErrorPage404 = () => {
  return (
    <Layout>
      <div className='mx-auto flex h-[75vh] flex-col items-center justify-center'>
        <div className='max-w-lg rounded-lg bg-amber-50 p-8 shadow-md shadow-amber-50'>
          <SparklesIcon className='h-8 w-8 text-amber-700' />
          <h1 className='pt-4'>404 - Page Not Found</h1>
          <p className='pt-3'>
            The page you are looking for does not exist. Please check the URL or go back to the{' '}
            <Link href='/' className='link'>
              homepage
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  )
}

export default ErrorPage404
