/** biome-ignore-all lint/nursery/useSortedClasses: <explanation> */
"use client";

import {
	ArrowRight,
	Search,
	Workflow,
} from "lucide-react";

export default function DataConsumers() {
	return (
		<section className="relative overflow-hidden bg-white py-10">
			<div className="mx-auto max-w-7xl px-6 lg:px-8">
				{/* Section Header */}
				<div className="">
					<h2 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl text-balance">
						Find Data. Connect Everything.
					</h2>
					<p className="mt-4 text-lg leading-8 text-gray-600 text-pretty max-w-xl">
						Access verified property comps instantly and push them directly into
						your existing tools. One search, infinite possibilities.
					</p>
					<div className="mt-6">
						<button
							type="button"
							className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-8 py-4 text-base font-semibold text-white transition-all duration-300 hover:bg-gray-800 hover:shadow-xl hover:shadow-gray-900/30"
						>
							Explore Marketplace
							<ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
						</button>
					</div>
				</div>

				{/* Dynamic Asymmetric Layout */}
				<div className="mt-16">
					<div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
						
						<div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 lg:col-span-6 h-[400px] overflow-hidden">
							<div className="flex h-12 w-12 items-center justify-center rounded-lg border border-gray-200 bg-black">
								<Search className="h-6 w-6 text-white" />
							</div>
							<h3 className="mt-6 text-lg font-bold text-black">
								Instant Search
							</h3>
							<p className="mt-2 text-base text-gray-600">
								Search our live marketplace by address, city, or zip code. Discover accurate,
              ready-to-use comps in seconds — no digging required.
							</p>
							<div className="relative">
								{/* Search Mockup */}
								<div className="mt-8 space-y-4">
									
									{/* Results Preview */}
									<div className="space-y-3 rounded-xl border border-gray-100 bg-gray-50/50 p-4">
										<div className="flex items-center justify-between">
											<div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
												Results
											</div>
											<div className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
												Live
											</div>
										</div>
										{[1, 2, 3].map((i) => (
											<div
												key={i}
												className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition-all duration-200 hover:border-blue-200 hover:shadow-md"
											>
												<div className="h-12 w-12 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200" />
												<div className="flex-1 space-y-1.5">
													<div className="h-2 w-3/4 rounded-full bg-gray-200" />
													<div className="h-2 w-1/2 rounded-full bg-gray-100" />
												</div>
												<div className="text-xs font-semibold text-gray-900">
													${(Math.random() * 500 + 500).toFixed(0)}K
												</div>
											</div>
										))}
									</div>
								</div>
							</div>
						</div>

						{/* Integrate */}
						<div className="flex flex-col rounded-2xl border border-gray-200 p-8 lg:col-span-6 h-[400px] overflow-hidden">
							<div className="flex h-12 w-12 items-center justify-center rounded-lg border border-gray-200 bg-black">
								<Workflow className="h-6 w-6 text-white" />
							</div>
							<h3 className="mt-6 text-lg font-bold text-black">
								Integrate With Your Workflow
							</h3>
							<p className="mt-2 text-base text-gray-600">
								Connect to the systems you already use — CRMs, valuation tools, or analytics dashboards.
              Keep your data flowing without friction or manual exports.
							</p>

							<IntegrationsMockup />
						</div>
					</div>
				</div>
			</div>

			<style jsx>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -100;
          }
        }
      `}</style>
		</section>
	);
}

function IntegrationsMockup() {
	return (
		<div className="relative mt-6 flex h-32 items-center justify-center">
			{/* Central Hub */}
			<div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-gray-900 to-gray-700 shadow-lg shadow-gray-900/30">
				<div className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
			</div>

			{/* Connecting Lines */}
			<svg
				className="absolute inset-0 h-full w-full"
				xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
			>
				<line
					x1="50%"
					y1="50%"
					x2="20%"
					y2="20%"
					stroke="#e5e7eb"
					strokeWidth="2"
					strokeDasharray="4 4"
					className="animate-[dash_20s_linear_infinite]"
				/>
				<line
					x1="50%"
					y1="50%"
					x2="80%"
					y2="20%"
					stroke="#e5e7eb"
					strokeWidth="2"
					strokeDasharray="4 4"
					className="animate-[dash_20s_linear_infinite]"
					style={{ animationDelay: "0.5s" }}
				/>
				<line
					x1="50%"
					y1="50%"
					x2="20%"
					y2="80%"
					stroke="#e5e7eb"
					strokeWidth="2"
					strokeDasharray="4 4"
					className="animate-[dash_20s_linear_infinite]"
					style={{ animationDelay: "1s" }}
				/>
				<line
					x1="50%"
					y1="50%"
					x2="80%"
					y2="80%"
					stroke="#e5e7eb"
					strokeWidth="2"
					strokeDasharray="4 4"
					className="animate-[dash_20s_linear_infinite]"
					style={{ animationDelay: "1.5s" }}
				/>
			</svg>

			{/* Tool Logos */}
			{[
				{ position: "left-2 top-2", color: "from-blue-500 to-blue-600" },
				{ position: "right-2 top-2", color: "from-green-500 to-green-600" },
				{ position: "left-2 bottom-2", color: "from-orange-500 to-orange-600" },
				{
					position: "right-2 bottom-2",
					color: "from-purple-500 to-purple-600",
				},
			].map((tool) => (
				<div
					key={tool.position}
					className={`absolute ${tool.position} flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${tool.color} shadow-lg transition-transform duration-300 hover:scale-110`}
				>
					<div className="h-4 w-4 rounded-full bg-white/30" />
				</div>
			))}
		</div>
	);
}
