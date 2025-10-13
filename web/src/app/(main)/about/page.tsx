/** biome-ignore-all lint/nursery/useSortedClasses: <explanation> */
import React from "react";
import {
	Building2,
	Target,
	Users,
	Zap,
	Shield,
	TrendingUp,
	Heart,
	Award,
	Globe,
	Clock,
} from "lucide-react";

export default function About() {
	return (
		<div className="bg-white">
			<section className="relative overflow-hidden border-b border-gray-100">
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

				<div className="relative mx-auto max-w-7xl px-6 lg:px-8 py-16 md:py-24">
					<div className="flex items-center gap-4 mb-6">
						<div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
							<Building2 className="h-8 w-8 text-blue-600" />
						</div>
						<div>
							<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black">
								About Kompa
							</h1>
						</div>
					</div>
					<p className="text-lg md:text-xl text-gray-600 max-w-3xl leading-relaxed">
						We're on a mission to democratize access to property data, making
						professional-grade real estate insights available to everyone.
					</p>
				</div>
			</section>

			<section className="mx-auto max-w-7xl px-6 lg:px-8 py-16 md:py-20">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
					<div>
						<div className="inline-block px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-semibold mb-6">
							Our Story
						</div>
						<h2 className="text-3xl md:text-4xl font-bold text-black mb-6">
							Transforming How People Access Property Data
						</h2>
						<div className="space-y-4 text-gray-700 leading-relaxed">
							<p>
								Kompa was founded with a simple belief: access to accurate,
								comprehensive property data shouldn't be limited to large
								corporations or require expensive subscriptions.
							</p>
							<p>
								We've built a platform that combines data from multiple trusted
								sources, providing real estate professionals, investors, and
								homebuyers with the insights they need to make informed
								decisions.
							</p>
							<p>
								Today, we serve thousands of users nationwide, from individual
								home buyers to real estate agencies, helping them find the
								perfect comps and understand market trends with confidence.
							</p>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-2xl p-6 md:p-8">
							<div className="text-4xl md:text-5xl font-bold text-black mb-2">
								10M+
							</div>
							<div className="text-sm text-gray-600">Properties Listed</div>
						</div>
						<div className="bg-gradient-to-br from-green-50 to-white border border-green-100 rounded-2xl p-6 md:p-8 mt-8">
							<div className="text-4xl md:text-5xl font-bold text-black mb-2">
								1K+
							</div>
							<div className="text-sm text-gray-600">Active Users</div>
						</div>
						<div className="bg-gradient-to-br from-purple-50 to-white border border-purple-100 rounded-2xl p-6 md:p-8 -mt-8">
							<div className="text-4xl md:text-5xl font-bold text-black mb-2">
								50+
							</div>
							<div className="text-sm text-gray-600">States Covered</div>
						</div>
						<div className="bg-gradient-to-br from-orange-50 to-white border border-orange-100 rounded-2xl p-6 md:p-8">
							<div className="text-4xl md:text-5xl font-bold text-black mb-2">
								24/7
							</div>
							<div className="text-sm text-gray-600">Data Updates</div>
						</div>
					</div>
				</div>
			</section>

			<section className="bg-gray-50 py-16 md:py-20">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="text-center mb-12 md:mb-16">
						<div className="inline-block px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-semibold mb-4">
							Our Mission
						</div>
						<h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
							Why We Do What We Do
						</h2>
						<p className="text-lg text-gray-600 max-w-2xl mx-auto">
							We're committed to empowering everyone with the data they need to
							make smarter real estate decisions.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{[
							{
								icon: Target,
								color: "blue",
								title: "Accurate Data",
								description:
									"We aggregate data from trusted sources to ensure you get the most reliable property information available.",
							},
							{
								icon: Zap,
								color: "green",
								title: "Lightning Fast",
								description:
									"Find comparable properties in seconds with our optimized search technology and intuitive interface.",
							},
							{
								icon: Shield,
								color: "purple",
								title: "Secure & Private",
								description:
									"Your data security is our priority. We employ industry-leading security measures to protect your information.",
							},
						].map((item) => (
							<div
								key={item.title}
								className="bg-white rounded-2xl border border-gray-200 p-8 hover:shadow-lg transition-shadow"
							>
								<div
									className={`w-12 h-12 bg-${item.color}-50 rounded-xl flex items-center justify-center mb-6`}
								>
									<item.icon
										className={`h-6 w-6 text-${item.color}-600`}
									/>
								</div>
								<h3 className="text-xl font-bold text-black mb-3">
									{item.title}
								</h3>
								<p className="text-gray-600 leading-relaxed">
									{item.description}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			<section className="mx-auto max-w-7xl px-6 lg:px-8 py-16 md:py-20">
				<div className="text-center mb-12 md:mb-16">
					<div className="inline-block px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-semibold mb-4">
						Our Values
					</div>
					<h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
						What Drives Us
					</h2>
					<p className="text-lg text-gray-600 max-w-2xl mx-auto">
						Our core values guide everything we do, from product development to
						customer support.
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					{[
						{
							icon: Users,
							title: "User-First",
							description:
								"We prioritize user experience and feedback in every decision we make.",
						},
						{
							icon: TrendingUp,
							title: "Innovation",
							description:
								"We constantly evolve our platform to meet the changing needs of the market.",
						},
						{
							icon: Heart,
							title: "Integrity",
							description:
								"We're transparent in our practices and committed to ethical data handling.",
						},
						{
							icon: Award,
							title: "Excellence",
							description:
								"We strive for the highest standards in data quality and service delivery.",
						},
					].map((value) => (
						<div
							key={value.title}
							className="bg-white rounded-xl border border-gray-100 p-6 text-center hover:border-blue-200 transition-colors"
						>
							<div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
								<value.icon className="h-6 w-6 text-gray-700" />
							</div>
							<h3 className="text-lg font-bold text-black mb-2">
								{value.title}
							</h3>
							<p className="text-sm text-gray-600">{value.description}</p>
						</div>
					))}
				</div>
			</section>

			<section className="bg-gray-50 py-16 md:py-20">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="text-center mb-12 md:mb-16">
						<div className="inline-block px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-semibold mb-4">
							What Makes Us Different
						</div>
						<h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
							The Kompa Advantage
						</h2>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
						{[
							{
								icon: Globe,
								title: "Comprehensive Coverage",
								description:
									"Access property data from over 10 million listings across all 50 states, updated in real-time.",
								benefits: [
									"Nationwide property database",
									"Multiple data sources",
									"Regular updates",
								],
							},
							{
								icon: Zap,
								title: "Instant Search Results",
								description:
									"Our advanced search technology delivers comparable properties in seconds, not minutes.",
								benefits: [
									"Lightning-fast queries",
									"Smart filtering options",
									"Customizable parameters",
								],
							},
							{
								icon: Shield,
								title: "Data You Can Trust",
								description:
									"We verify and validate data from multiple sources to ensure accuracy and reliability.",
								benefits: [
									"Verified property data",
									"Quality assurance checks",
									"Transparent sourcing",
								],
							},
							{
								icon: Users,
								title: "Built for Professionals",
								description:
									"Features designed specifically for real estate professionals, investors, and agencies.",
								benefits: [
									"Professional tools",
									"Bulk search capabilities",
									"API access available",
								],
							},
						].map((feature) => (
							<div
								key={feature.title}
								className="bg-white rounded-2xl border border-gray-200 p-8"
							>
								<div className="flex items-start gap-4 mb-6">
									<div className="p-3 bg-blue-50 rounded-xl shrink-0">
										<feature.icon className="h-6 w-6 text-blue-600" />
									</div>
									<div>
										<h3 className="text-xl font-bold text-black mb-2">
											{feature.title}
										</h3>
										<p className="text-gray-600">{feature.description}</p>
									</div>
								</div>
								<ul className="space-y-2">
									{feature.benefits.map((benefit) => (
										<li
											key={benefit}
											className="flex items-center gap-2 text-sm text-gray-700"
										>
											<div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
											{benefit}
										</li>
									))}
								</ul>
							</div>
						))}
					</div>
				</div>
			</section>

			<section className="mx-auto max-w-7xl px-6 lg:px-8 py-16 md:py-20">
				<div className="bg-white rounded-2xl border border-gray-200 p-8 md:p-12">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
						<div>
							<div className="inline-block px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-semibold mb-4">
								Join Us
							</div>
							<h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
								Be Part of Our Journey
							</h2>
							<p className="text-lg text-gray-600 mb-6">
								We're building the future of property data access, and we'd love
								for you to be part of it. Whether you're a real estate
								professional, investor, or first-time homebuyer, Kompa is here
								to support your journey.
							</p>
							<div className="space-y-3">
								{[
									"Access accurate property comparables instantly",
									"Make data-driven real estate decisions",
									"Save time with intelligent search tools",
									"Join thousands of satisfied users",
								].map((item) => (
									<div key={item} className="flex items-center gap-3">
										<div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center shrink-0">
											<svg
                      aria-hidden="true"
												className="w-4 h-4 text-green-600"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M5 13l4 4L19 7"
												/>
											</svg>
										</div>
										<span className="text-gray-700">{item}</span>
									</div>
								))}
							</div>
						</div>

						<div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-8">
							<div className="space-y-6">
								<div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-100">
									<Clock className="h-8 w-8 text-blue-600 shrink-0" />
									<div>
										<div className="font-semibold text-black">
											24/7 Support
										</div>
										<div className="text-sm text-gray-600">
											Our team is always here to help
										</div>
									</div>
								</div>

								<div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-100">
									<Shield className="h-8 w-8 text-green-600 shrink-0" />
									<div>
										<div className="font-semibold text-black">
											Secure Platform
										</div>
										<div className="text-sm text-gray-600">
											Your data is protected with enterprise-grade security
										</div>
									</div>
								</div>

								<div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-100">
									<TrendingUp className="h-8 w-8 text-purple-600 shrink-0" />
									<div>
										<div className="font-semibold text-black">
											Constantly Improving
										</div>
										<div className="text-sm text-gray-600">
											Regular updates and new features
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="mx-auto max-w-7xl px-6 lg:px-8 py-12 mb-12">
				<div className="bg-[#2a2a2a] rounded-2xl p-8 md:p-12 text-center border border-[#4a4a5c]">
					<h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
						Ready to Get Started?
					</h3>
					<p className="text-gray-300 mb-6 max-w-2xl mx-auto">
						Join thousands of real estate professionals and investors who trust
						Kompa for accurate property data.
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<a
							href="/auth/signup"
							className="inline-block px-8 py-3 bg-white text-[#2a2a2a] font-semibold rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
						>
							Start Free Trial
						</a>
						<a
							href="/contact"
							className="inline-block px-8 py-3 bg-transparent text-white font-semibold rounded-lg border border-[#4a4a5c] hover:bg-[#323232] transition-colors"
						>
							Contact Sales
						</a>
					</div>
				</div>
			</section>
		</div>
	);
}
