/** biome-ignore-all lint/nursery/useSortedClasses: <explanation> */
import { Search, MapPin } from "lucide-react";

export default function Hero() {
	return (
		<section className="relative bg-gradient-to-br from-gray-50 to-white min-h-screen flex items-center overflow-hidden">
			{/* Subtle background elements */}
			<div
				className="absolute inset-0 opacity-[0.03]"
				style={{
					backgroundImage: `
          linear-gradient(to right, #3b82f6 1px, transparent 1px),
          linear-gradient(to bottom, #3b82f6 1px, transparent 1px)
        `,
					backgroundSize: "60px 60px",
				}}
			/>

			<div className="mx-auto max-w-7xl px-6 lg:px-8 w-full py-20">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
					{/* Left side - Main content */}
					<div className="max-w-xl">
						<h1 className="text-6xl md:text-7xl font-bold text-black leading-[1.1] mb-6">
							Find Property Comps <span>Fast & Easy</span>
						</h1>
						<p className="text-lg text-gray-600 mb-8 leading-relaxed">
							Access comprehensive comparable data for 10M+ properties
							nationwide. Make confident decisions with verified market
							insights.
						</p>
						5
						<div className="relative mb-8">
							<MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
							<input
								type="text"
								placeholder="Enter address or location"
								className="w-full pl-12 pr-[60px] py-3.5 rounded-xl bg-white/60 backdrop-blur-sm text-black border border-gray-200/50 focus:outline-none focus:ring-2 focus:ring-[#4a4a5c] transition-all shadow-sm"
							/>
							<button
								type="button"
								className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-[#2a2a2a] text-white rounded-[8px] border border-[#4a4a5c]  hover:bg-[#323232] transition-colors"
								aria-label="Search"
							>
								<Search className="h-5 w-5" />
							</button>
						</div>
						<div className="flex items-center gap-12">
							<div>
								<div className="flex items-baseline gap-1 mb-1">
									<span className="text-4xl font-bold text-black">10M</span>
									<span className="text-2xl text-blue-600">+</span>
								</div>
								<div className="text-sm text-gray-600">Properties Listed</div>
							</div>
							<div>
								<div className="flex items-baseline gap-1 mb-1">
									<span className="text-4xl font-bold text-black">1K</span>
									<span className="text-2xl text-blue-600">+</span>
								</div>
								<div className="text-sm text-gray-600">
									Professionals Trust Us
								</div>
							</div>
						</div>
					</div>

				
					<div className="relative">
						
						<div className="bg-white rounded-2xl  border border-gray-100 overflow-hidden">
							
							<div className="h-56 relative border-b border-gray-100 overflow-hidden">
								
								<img
									src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80"
									alt="Property"
									className="w-full h-full object-cover"
								/>
								
								<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

								
								<div className="absolute top-4 right-4 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-sm font-semibold text-blue-600 border border-white/50 shadow-lg">
									0.2 mi away
								</div>
							</div>

							{/* Property details - clean grid */}
							<div className="p-6">
								<div className="flex items-center justify-between mb-6">
									<div>
										<div className="text-3xl font-bold text-black mb-1">
											$1,250,000
										</div>
										<div className="text-sm text-gray-500">
											Sold November 2024
										</div>
									</div>
									<div className="px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium border border-green-100">
										Verified
									</div>
								</div>

								{/* Property specs - structured grid */}
								<div className="grid grid-cols-3 gap-4 mb-6">
									<div className="text-center p-3 bg-gray-50 rounded-lg">
										<div className="text-2xl font-bold text-black">3</div>
										<div className="text-xs text-gray-600 mt-1">Bedrooms</div>
									</div>
									<div className="text-center p-3 bg-gray-50 rounded-lg">
										<div className="text-2xl font-bold text-black">2</div>
										<div className="text-xs text-gray-600 mt-1">Bathrooms</div>
									</div>
									<div className="text-center p-3 bg-gray-50 rounded-lg">
										<div className="text-2xl font-bold text-black">1.8K</div>
										<div className="text-xs text-gray-600 mt-1">Sq Ft</div>
									</div>
								</div>

								{/* Address */}
								<div className="flex items-center gap-2 text-sm text-gray-600 border-t border-gray-100 pt-4">
									<MapPin className="h-4 w-4" />
									<span>No. 18 Oakridge Lane, Ahodwo Estates, Kumasi</span>
								</div>
							</div>
						</div>

						{/* Secondary structured cards - stacked professionally below */}
						<div className="mt-4 space-y-3">
							<div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 flex items-center justify-between">
								<div className="flex items-center gap-3">
									<div className="w-12 h-12 rounded-lg overflow-hidden">
										<img
											src="https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=200&q=80"
											alt="Property"
											className="w-full h-full object-cover"
										/>
									</div>
									<div>
										<div className="text-lg font-bold text-black">
											$1,180,000
										</div>
										<div className="text-xs text-gray-500">Sold Oct 2024</div>
									</div>
								</div>
								<div className="text-sm text-blue-600 font-medium">0.3 mi</div>
							</div>

							<div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 flex items-center justify-between">
								<div className="flex items-center gap-3">
									<div className="w-12 h-12 rounded-lg overflow-hidden">
										<img
											src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=200&q=80"
											alt="Property"
											className="w-full h-full object-cover"
										/>
									</div>
									<div>
										<div className="text-lg font-bold text-black">
											$1,295,000
										</div>
										<div className="text-xs text-gray-500">Sold Sep 2024</div>
									</div>
								</div>
								<div className="text-sm text-blue-600 font-medium">0.4 mi</div>
							</div>
						</div>

						{/* Subtle accent - professional circle */}
						<div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-600 rounded-full opacity-5 blur-2xl" />
					</div>
				</div>
			</div>
		</section>
	);
}
