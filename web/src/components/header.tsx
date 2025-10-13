/** biome-ignore-all lint/nursery/useSortedClasses: <explanation> */
'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Search } from 'lucide-react'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigation = [
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Documentation', href: '/docs' },
    { name: 'About', href: '/about' },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-200/50">
      <nav className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
        
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#4a4a5c] rounded-lg flex items-center justify-center">
                <Search className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-black">Kompa</span>
            </Link>
          </div>


          <div className="hidden md:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                // @ts-ignore
                href={item.href}
                className="text-sm font-medium text-gray-700 hover:underline transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-gray-700 hover:underline transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="relative group"
            >
              <div className="bg-[#2a2a2a] text-white rounded-[8px] border border-[#4a4a5c] shadow-[0 0 4px 0 #0a0a10] hover:bg-[#323232] transition-colors px-5 py-2">
                Get Started
              </div>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Open menu</span>
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200/50">
          <div className="px-6 py-4 space-y-3 bg-white/95 backdrop-blur-xl">
            {navigation.map((item) => (
              <Link
                key={item.name}
                // @ts-ignore
                href={item.href}
                className="block text-base font-medium text-gray-700 hover:underline transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 space-y-3 border-t border-gray-200">
              <Link
                href="/login"
                className="block text-base font-medium text-gray-700 hover:underline transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="block"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="bg-[#2a2a2a] text-white rounded-[8px] border border-[#4a4a5c] text-center hover:bg-[#323232] transition-colors px-5 py-3">
                  Get Started
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
