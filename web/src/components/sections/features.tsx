/** biome-ignore-all lint/nursery/useSortedClasses: <explanation> */
import { Search, Database, TrendingUp, MapPin, FileDown, Code, CheckCircle } from 'lucide-react'

export default function Features() {
  return (
    <section id='features' className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-base font-semibold leading-7" style={{ color: '#4a4a5c' }}>Everything you need</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-black sm:text-4xl">
            Built for real estate professionals
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Find comparable properties, analyze market trends, and make confident decisions—all in one platform.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Large Card 1 - Powerful Search (2 cols) */}
          <div className="lg:col-span-2 bg-gray-50 rounded-3xl p-6 sm:p-8 lg:p-10 relative overflow-hidden min-h-[420px]">
            <div className="relative z-10">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mb-4 sm:mb-6" style={{ backgroundColor: '#4a4a5c' }}>
                <Search className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-black mb-3 sm:mb-4">
                Advanced Property Search
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-xl mb-6 sm:mb-8">
                Search and find exact matches by address, neighborhood, property type, price range, and square footage.
              </p>
            </div>


            <div className="absolute bottom-4 right-4 left-4 sm:right-6 sm:left-6 lg:right-8 lg:left-8">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-3 sm:p-4 max-w-2xl">
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
                  <div className="flex-1 bg-gradient-to-br from-gray-50 to-white rounded-xl px-3 py-3 sm:px-5 sm:py-4 text-sm sm:text-base text-gray-800 border border-gray-200 font-medium">
                    48 Sunrise Drive, East Legon Heights, Accra
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#4a4a5c' }}>
                    <Search className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  <div className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-900 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm">
                    Single Family
                  </div>
                  <div className="px-3 py-1.5 sm:px-4 sm:py-2 bg-white border border-gray-300 rounded-xl text-xs sm:text-sm font-medium text-gray-700">
                    3+ beds
                  </div>
                  <div className="px-3 py-1.5 sm:px-4 sm:py-2 bg-white border border-gray-300 rounded-xl text-xs sm:text-sm font-medium text-gray-700">
                    2+ baths
                  </div>
                  <div className="md:block hidden px-3 py-1.5 sm:px-4 sm:py-2 bg-white border border-gray-300 rounded-xl text-xs sm:text-sm font-medium text-gray-700">
                    $1M - $2M
                  </div>
                  <div className="md:block hidden px-3 py-1.5 sm:px-4 sm:py-2 bg-white border border-gray-300 rounded-xl text-xs sm:text-sm font-medium text-gray-700">
                    1,500+ sqft
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2 - Quick Comparables */}
          <div className="bg-gray-50 rounded-3xl p-6 sm:p-8 relative overflow-hidden min-h-[420px]">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mb-4 sm:mb-6" style={{ backgroundColor: '#4a4a5c' }}>
              <TrendingUp className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-black mb-3 sm:mb-4">
              Quick Comparables
            </h3>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-6 sm:mb-8">
              Find similar properties for your next valuation or appraisal project instantly.
            </p>

            {/* Simple comparables list */}
            <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6 lg:left-8 lg:right-8">
              <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-sm border border-gray-200 space-y-2">
                <div className="md:hidden flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-900">42 Sunrise Dr</p>
                    <p className="text-[10px] sm:text-xs text-gray-500">3 bed • 2 bath</p>
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-black">$1.75M</span>
                </div>
                <div className=" flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-900">56 Palm Ave</p>
                    <p className="text-[10px] sm:text-xs text-gray-500">3 bed • 2 bath</p>
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-black">$1.82M</span>
                </div>
                <div className="flex items-center justify-between p-2 sm:p-3 rounded-lg border-2 border-dashed" style={{ borderColor: '#4a4a5c' }}>
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm font-semibold text-gray-900">48 Sunrise Dr</p>
                    <p className="text-[10px] sm:text-xs font-medium" style={{ color: '#4a4a5c' }}>Subject Property</p>
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-black">$1.80M</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3 - Comprehensive Data */}
          <div className="bg-gray-50 rounded-3xl p-8 min-h-[380px] flex flex-col">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6" style={{ backgroundColor: '#4a4a5c' }}>
              <Database className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-black mb-4">
              Comprehensive Property Data
            </h3>
            <p className="text-base text-gray-600 leading-relaxed mb-6">
              Access detailed property information including sales history, tax records, ownership info, and neighborhood insights.
            </p>

            {/* Enhanced stats display */}
            <div className="mt-auto space-y-4">
              <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                <span className="text-base font-medium text-gray-700">Accurate Data</span>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#4a4a5c' }}>
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                <span className="text-base font-medium text-gray-700">Real-Time Updates</span>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#4a4a5c' }}>
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                <span className="text-base font-medium text-gray-700">Verified Sources</span>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#4a4a5c' }}>
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Card 4 - Export Reports (2 cols) */}
          <div className="lg:col-span-2 bg-gray-50 rounded-3xl p-10 min-h-[380px]">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6" style={{ backgroundColor: '#4a4a5c' }}>
              <FileDown className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-black mb-4">
              Professional Client Reports
            </h3>
            <p className="text-base text-gray-600 leading-relaxed mb-8 max-w-xl">
              Generate polished, branded PDF reports in seconds. Include property photos, comparable analysis, market trends, and custom notes. Perfect for client presentations and appraisal documentation.
            </p>
            
            {/* Beautiful report preview */}
            <div className="flex gap-4 mt-8">
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex-1 max-w-[200px]">
                <div className="w-full h-4 rounded mb-3" style={{ backgroundColor: '#4a4a5c' }} />
                <div className="w-3/4 h-3 bg-gray-200 rounded mb-6" />
                <div className="space-y-3 mb-4">
                  <div className="w-full h-20 bg-gradient-to-br from-gray-100 to-gray-50 rounded-lg" />
                  <div className="w-full h-2 bg-gray-200 rounded" />
                  <div className="w-full h-2 bg-gray-200 rounded" />
                  <div className="w-4/5 h-2 bg-gray-200 rounded" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="h-12 bg-gray-100 rounded" />
                  <div className="h-12 bg-gray-100 rounded" />
                </div>
              </div>
              <div className="hidden md:block bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex-1 max-w-[200px] opacity-70">
                <div className="w-full h-4 bg-gray-300 rounded mb-3" />
                <div className="w-3/4 h-3 bg-gray-200 rounded mb-6" />
                <div className="space-y-3">
                  <div className="w-full h-20 bg-gray-100 rounded-lg" />
                  <div className="w-full h-2 bg-gray-200 rounded" />
                  <div className="w-full h-2 bg-gray-200 rounded" />
                </div>
              </div>
              <div className="hidden md:block bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex-1 max-w-[200px] opacity-40">
                <div className="w-full h-4 bg-gray-300 rounded mb-3" />
                <div className="w-3/4 h-3 bg-gray-200 rounded" />
              </div>
            </div>
          </div>

          {/* Card 5 - Interactive Maps */}
          <div className="bg-gray-50 rounded-3xl p-8 min-h-[380px]">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6" style={{ backgroundColor: '#4a4a5c' }}>
              <MapPin className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-black mb-4">
              Interactive Map View
            </h3>
            <p className="text-base text-gray-600 leading-relaxed mb-8">
              Visualize properties and comparables on an interactive map. See distances, neighborhoods, and proximity to amenities at a glance.
            </p>
            
            {/* Realistic map mockup */}
            <div className="bg-white rounded-2xl border border-gray-200 p-4 aspect-square relative overflow-hidden shadow-sm">
              {/* Map background - resembling actual map tiles */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-gray-50 to-white" />

              {/* Street grid to resemble actual map */}
              <svg className="absolute inset-0 w-full h-full">
                {/* Major streets - darker */}
                <line x1="0" y1="35%" x2="100%" y2="35%" stroke="#d1d5db" strokeWidth="3" />
                <line x1="0" y1="65%" x2="100%" y2="65%" stroke="#d1d5db" strokeWidth="3" />
                <line x1="30%" y1="0" x2="30%" y2="100%" stroke="#d1d5db" strokeWidth="3" />
                <line x1="70%" y1="0" x2="70%" y2="100%" stroke="#d1d5db" strokeWidth="3" />

                {/* Minor streets - lighter */}
                <line x1="0" y1="15%" x2="100%" y2="15%" stroke="#e5e7eb" strokeWidth="2" />
                <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#e5e7eb" strokeWidth="2" />
                <line x1="0" y1="85%" x2="100%" y2="85%" stroke="#e5e7eb" strokeWidth="2" />
                <line x1="15%" y1="0" x2="15%" y2="100%" stroke="#e5e7eb" strokeWidth="2" />
                <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#e5e7eb" strokeWidth="2" />
                <line x1="85%" y1="0" x2="85%" y2="100%" stroke="#e5e7eb" strokeWidth="2" />

                {/* Park/green space representation */}
                <rect x="55%" y="40%" width="30" height="30" fill="#d1fae5" opacity="0.6" rx="2" />
                <circle cx="67%" cy="52%" r="8" fill="#86efac" opacity="0.4" />
              </svg>

              {/* Property markers with modern vertical indicators */}
              <div className="absolute top-[25%] left-[40%]">
                <div className="relative group cursor-pointer flex flex-col items-center">
                  {/* Price label at top */}
                  <div className="bg-white px-2 py-1 rounded-md shadow-sm border border-gray-200 mb-1">
                    <span className="text-xs font-bold text-black">$1.8M</span>
                  </div>
                  {/* Dotted vertical line */}
                  <div className="w-0.5 h-12 border-l-2 border-dashed opacity-60" style={{ borderColor: '#4a4a5c' }} />
                  {/* Pin */}
                  <div className="w-3 h-3 rounded-full shadow-sm animate-pulse" style={{ backgroundColor: '#4a4a5c' }} />
                </div>
              </div>

              <div className="absolute top-[45%] right-[25%]">
                <div className="relative group cursor-pointer flex flex-col items-center">
                  {/* Price label at top */}
                  <div className="bg-white px-2 py-0.5 rounded-md shadow-sm border border-gray-200 mb-1">
                    <span className="text-xs font-semibold text-gray-700">$1.5M</span>
                  </div>
                  {/* Dotted vertical line */}
                  <div className="w-0.5 h-8 border-l-2 border-dashed border-gray-400 opacity-50" />
                  {/* Pin */}
                  <div className="w-2.5 h-2.5 rounded-full shadow-sm bg-gray-400" />
                </div>
              </div>

              <div className="absolute bottom-[30%] left-[55%]">
                <div className="relative group cursor-pointer flex flex-col items-center">
                  {/* Price label at top */}
                  <div className="bg-white px-2 py-0.5 rounded-md shadow-sm border border-gray-200 mb-1">
                    <span className="text-xs font-semibold text-gray-700">$1.6M</span>
                  </div>
                  {/* Dotted vertical line */}
                  <div className="w-0.5 h-10 border-l-2 border-dashed border-gray-400 opacity-50" />
                  {/* Pin */}
                  <div className="w-2.5 h-2.5 rounded-full shadow-sm bg-gray-400" />
                </div>
              </div>

              <div className="absolute top-[55%] left-[20%]">
                <div className="relative group cursor-pointer flex flex-col items-center">
                  {/* Price label at top */}
                  <div className="bg-white px-2 py-1 rounded-md shadow-sm border border-gray-200 mb-1">
                    <span className="text-xs font-bold text-black">$1.9M</span>
                  </div>
                  {/* Dotted vertical line */}
                  <div className="w-0.5 h-14 border-l-2 border-dashed opacity-60" style={{ borderColor: '#4a4a5c' }} />
                  {/* Pin */}
                  <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: '#4a4a5c' }} />
                </div>
              </div>

              {/* Map controls (bottom right corner) */}
              <div className="absolute bottom-4 right-4 flex flex-col gap-1">
                <button className="w-7 h-7 bg-white rounded shadow-sm border border-gray-200 flex items-center justify-center text-gray-700 font-bold text-sm hover:bg-gray-50">+</button>
                <button className="w-7 h-7 bg-white rounded shadow-sm border border-gray-200 flex items-center justify-center text-gray-700 font-bold text-sm hover:bg-gray-50">−</button>
              </div>

              {/* Distance indicator */}
              <div className="absolute bottom-4 left-4 bg-white px-2 py-1 rounded shadow-sm border border-gray-200 text-xs font-medium text-gray-700">
                500m
              </div>
            </div>
          </div>

          {/* Card 6 - Developer API */}
          <div className="md:col-span-2 bg-gray-50 rounded-3xl p-10 min-h-[380px]">
            <div className="flex flex-col h-full">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6" style={{ backgroundColor: '#4a4a5c' }}>
                <Code className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-black mb-4">
                Powerful Developer API
              </h3>
              <p className="text-base text-gray-600 leading-relaxed mb-8 max-w-2xl">
                Integrate property data directly into your applications with our RESTful API. Access real-time property information, market analytics, and comparable data programmatically. Built for developers, with comprehensive documentation and SDKs.
              </p>

              {/* API Code mockup */}
              <div className="flex gap-4 mt-auto">
                {/* Code snippet mockup */}
                <div className="flex-1 bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-700 overflow-hidden">
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-700">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <span className="text-xs text-gray-400 ml-2 font-mono">api.kompa.dev</span>
                  </div>
                  <div className="space-y-2 font-mono text-sm">
                    <div className="flex gap-2">
                      <span className="text-gray-500">1</span>
                      <div className="flex-1">
                        <span className="text-purple-400">POST</span>
                        <span className="text-gray-300"> /api/v1/search</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-gray-500">2</span>
                      <span className="text-gray-500">{`{`}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-gray-500">3</span>
                      <span className="text-blue-400 ml-4">"address"</span>
                      <span className="text-gray-300">:</span>
                      <span className="text-green-400">"East Legon"</span>
                      <span className="text-gray-300">,</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-gray-500">4</span>
                      <span className="text-blue-400 ml-4">"bedrooms"</span>
                      <span className="text-gray-300">:</span>
                      <span className="text-yellow-400">3</span>
                      <span className="text-gray-300">,</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-gray-500">5</span>
                      <span className="text-blue-400 ml-4">"max_price"</span>
                      <span className="text-gray-300">:</span>
                      <span className="text-yellow-400">2000000</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-gray-500">6</span>
                      <span className="text-gray-500">{`}`}</span>
                    </div>
                  </div>
                </div>

                {/* Response mockup */}
                <div className="md:flex-1 md:block hidden bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Response</span>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-xs font-semibold text-green-600">200 OK</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Properties Found</span>
                      <span className="text-lg font-bold text-black">248</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Response Time</span>
                      <span className="text-lg font-bold text-black">124ms</span>
                    </div>
                    <div className="flex items-center gap-2 pt-2">
                      <CheckCircle className="h-4 w-4" style={{ color: '#4a4a5c' }} />
                      <span className="text-xs font-medium text-gray-600">REST & GraphQL support</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" style={{ color: '#4a4a5c' }} />
                      <span className="text-xs font-medium text-gray-600">Rate limit: 10,000 req/hour</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
