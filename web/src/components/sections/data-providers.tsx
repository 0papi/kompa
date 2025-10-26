/** biome-ignore-all lint/nursery/useSortedClasses: <explanation> */
import {
  Upload,
  DollarSign,
  Shield,
  CheckCircle,
  ArrowRight,
} from 'lucide-react'
import Link from 'next/link'

// NEW: A simple, abstract component to act as a visual placeholder in each card.
function FeatureGraphic({
  variant,
}: {
  variant: 'revenue' | 'integration' | 'security'
}) {
  return (
    <div className="mt-8 overflow-hidden rounded-lg border border-gray-200 bg-gray-50/50 p-4">
      <div className="h-32 w-full">
        {variant === 'revenue' && (
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 200 128"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              y="64"
              width="24"
              height="64"
              rx="4"
              fill="currentColor"
              className="text-gray-200"
            />
            <rect
              x="32"
              y="32"
              width="24"
              height="96"
              rx="4"
              fill="currentColor"
              className="text-gray-300"
            />
            <rect
              x="64"
              y="80"
              width="24"
              height="48"
              rx="4"
              fill="currentColor"
              className="text-gray-200"
            />
            <rect
              x="96"
              width="24"
              height="128"
              rx="4"
              fill="currentColor"
              className="text-gray-400"
            />
            <rect
              x="128"
              y="48"
              width="24"
              height="80"
              rx="4"
              fill="currentColor"
              className="text-gray-300"
            />
            <rect
              x="160"
              y="96"
              width="24"
              height="32"
              rx="4"
              fill="currentColor"
              className="text-gray-200"
            />
          </svg>
        )}
        {variant === 'integration' && (
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 200 128"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="16"
              y="16"
              width="56"
              height="32"
              rx="4"
              className="stroke-current text-gray-300"
              strokeWidth="2"
            />
            <rect
              x="128"
              y="16"
              width="56"
              height="32"
              rx="4"
              className="stroke-current text-gray-300"
              strokeWidth="2"
            />
            <rect
              x="16"
              y="80"
              width="56"
              height="32"
              rx="4"
              className="stroke-current text-gray-300"
              strokeWidth="2"
            />
            <path
              d="M72 32H98M128 32H102M100 32V96H72"
              className="stroke-current text-gray-400"
              strokeWidth="2"
            />
          </svg>
        )}
        {variant === 'security' && (
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 200 128"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M32 64C32 46.3269 46.3269 32 64 32H136C153.673 32 168 46.3269 168 64V96H32V64Z"
              className="stroke-current text-gray-400"
              strokeWidth="2"
            />
            <path
              d="M88 32V24C88 19.5817 91.5817 16 96 16H104C108.418 16 112 19.5817 112 24V32"
              className="stroke-current text-gray-400"
              strokeWidth="2"
            />
            <circle
              cx="100"
              cy="80"
              r="12"
              className="stroke-current text-gray-300"
              strokeWidth="2"
            />
          </svg>
        )}
      </div>
    </div>
  )
}

export default function DataProviders() {
  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-left">
          <h2
            className="text-base font-semibold leading-7"
            style={{ color: '#4a4a5c' }}
          >
            Data Provider Program
          </h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-black sm:text-5xl">
            A Platform Built for Your Data
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600 max-w-xl">
            Monetize your proprietary property data with our secure, scalable, and
            easy-to-use platform. We handle the infrastructure so you can focus on
            quality.
          </p>
          <Link
           href="/signup"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-[8px] bg-black px-6 py-3.5 text-base font-semibold text-white shadow-sm transition-colors duration-300 hover:bg-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            >
              Become a Provider
              <ArrowRight className="h-4 w-4" />
            </Link>
        </div>

        
        <div className="mx-auto mt-8 grid max-w-none grid-cols-1 gap-8 md:max-w-2xl md:grid-cols-2 lg:max-w-7xl lg:grid-cols-3">
        
          <div className="flex flex-col rounded-2xl border border-gray-200 p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-gray-200 bg-black">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <h3 className="mt-6 text-lg font-bold text-black">
              Monetize Your Assets
            </h3>
            <p className="mt-2 text-base text-gray-600">
              Earn competitive revenue for every API call that utilizes your data. No
              hidden fees, just transparent earnings.
            </p>
            <FeatureGraphic variant="revenue" />
          </div>

          
          <div className="flex flex-col rounded-2xl border border-gray-200 p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-gray-200 bg-black">
              <Upload className="h-6 w-6 text-white"/>
            </div>
            <h3 className="mt-6 text-lg font-bold text-black">
              Seamless Integration
            </h3>
            <p className="mt-2 text-base text-gray-600">
              Connect via our robust REST API or simply upload CSV files. We handle
              the heavy lifting of validation and distribution.
            </p>
            <FeatureGraphic variant="integration" />
          </div>

          
          <div className="flex flex-col rounded-2xl border border-gray-200 p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-gray-200 bg-black">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h3 className="mt-6 text-lg font-bold text-black">
              Total Control & Security
            </h3>
            <p className="mt-2 text-base text-gray-600">
              You retain full ownership. Set granular access permissions while we
              protect your data with end-to-end encryption.
            </p>
            <FeatureGraphic variant="security" />
          </div>
        </div>
      </div>
    </section>
  )
}
