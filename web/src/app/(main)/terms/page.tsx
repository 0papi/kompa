/** biome-ignore-all lint/nursery/useSortedClasses: <explanation> */
/** biome-ignore-all lint/correctness/useUniqueElementIds: <explanation> */
import React from "react";
import {
	FileText,
	Shield,
	User,
	CreditCard,
	AlertTriangle,
	Mail,
	Clock,
	CheckCircle,
} from "lucide-react";

export default function Terms() {
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
							<FileText className="h-8 w-8 text-blue-600" />
						</div>
						<div>
							<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black">
								Terms of Service
							</h1>
						</div>
					</div>
					<p className="text-lg md:text-xl text-gray-600 max-w-3xl">
						Please read these terms carefully before using Kompa. By accessing
						or using our service, you agree to be bound by these terms.
					</p>
					<div className="mt-6 flex items-center gap-2 text-sm text-gray-500">
						<Clock className="h-4 w-4" />
						<span>Last updated: January 2025</span>
					</div>
				</div>
			</section>

			<section className="mx-auto max-w-7xl px-6 lg:px-8 py-12 md:py-16">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
					<aside className="lg:col-span-3">
						<div className="lg:sticky lg:top-24">
							<nav className="bg-white rounded-xl border border-gray-100 p-4 md:p-6 shadow-sm">
								<h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">
									Contents
								</h3>
								<ul className="space-y-3">
									{[
										{ icon: CheckCircle, label: "Acceptance of Terms" },
										{ icon: FileText, label: "Use of Service" },
										{ icon: User, label: "User Accounts" },
										{ icon: Shield, label: "Intellectual Property" },
										{ icon: CreditCard, label: "Payment Terms" },
										{ icon: AlertTriangle, label: "Prohibited Activities" },
										{ icon: Mail, label: "Contact Us" },
									].map((item) => (
										<li key={item.label}>
											<a
												href={`#${item.label.toLowerCase().replace(/\s+/g, "-")}`}
												className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors group"
											>
												<item.icon className="h-4 w-4 group-hover:text-blue-600" />
												<span>{item.label}</span>
											</a>
										</li>
									))}
								</ul>
							</nav>
						</div>
					</aside>

					<main className="lg:col-span-9">
						<div className="prose prose-lg max-w-none">
							<div
								id="acceptance-of-terms"
								className="bg-white rounded-xl border border-gray-100 p-6 md:p-8 mb-8 shadow-sm"
							>
								<div className="flex items-start gap-4 mb-6">
									<div className="p-2 bg-blue-50 rounded-lg shrink-0">
										<CheckCircle className="h-6 w-6 text-blue-600" />
									</div>
									<div>
										<h2 className="text-2xl md:text-3xl font-bold text-black mb-4">
											Acceptance of Terms
										</h2>
									</div>
								</div>

								<div className="space-y-6 text-gray-700">
									<p className="leading-relaxed">
										By accessing and using Kompa ("Service"), you accept and
										agree to be bound by the terms and provisions of this
										agreement. If you do not agree to these Terms of Service,
										please do not use the Service.
									</p>
									<div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
										<p className="text-sm text-blue-900">
											<strong>Important:</strong> These terms constitute a
											legally binding agreement between you and Kompa Inc. Your
											continued use of the Service will be deemed as acceptance of
											these terms.
										</p>
									</div>
									<p className="leading-relaxed">
										We reserve the right to update or modify these Terms of
										Service at any time without prior notice. Your continued use
										of the Service following any changes indicates your
										acceptance of the new terms.
									</p>
								</div>
							</div>

							<div
								id="use-of-service"
								className="bg-white rounded-xl border border-gray-100 p-6 md:p-8 mb-8 shadow-sm"
							>
								<div className="flex items-start gap-4 mb-6">
									<div className="p-2 bg-green-50 rounded-lg shrink-0">
										<FileText className="h-6 w-6 text-green-600" />
									</div>
									<div>
										<h2 className="text-2xl md:text-3xl font-bold text-black mb-4">
											Use of Service
										</h2>
									</div>
								</div>

								<div className="space-y-6 text-gray-700">
									<div>
										<h3 className="text-xl font-semibold text-black mb-3">
											Service Description
										</h3>
										<p className="leading-relaxed mb-4">
											Kompa provides access to comprehensive property comparable
											data, market insights, and real estate analytics for
											properties nationwide. Our platform is designed for real
											estate professionals, investors, and individuals seeking
											property information.
										</p>
									</div>

									<div>
										<h3 className="text-xl font-semibold text-black mb-3">
											License Grant
										</h3>
										<p className="leading-relaxed mb-3">
											Subject to these Terms, we grant you a limited,
											non-exclusive, non-transferable, revocable license to:
										</p>
										<ul className="space-y-2 ml-5 list-disc marker:text-blue-600">
											<li>Access and use the Service for your personal or business purposes</li>
											<li>View, search, and analyze property data and comparables</li>
											<li>
												Generate reports and insights based on available data
											</li>
											<li>
												Download and save information for your legitimate business needs
											</li>
										</ul>
									</div>

									<div>
										<h3 className="text-xl font-semibold text-black mb-3">
											Acceptable Use
										</h3>
										<p className="leading-relaxed">
											You agree to use the Service only for lawful purposes and
											in accordance with these Terms. You must not use the
											Service in any way that violates any applicable federal,
											state, local, or international law or regulation.
										</p>
									</div>
								</div>
							</div>

							<div
								id="user-accounts"
								className="bg-white rounded-xl border border-gray-100 p-6 md:p-8 mb-8 shadow-sm"
							>
								<div className="flex items-start gap-4 mb-6">
									<div className="p-2 bg-purple-50 rounded-lg shrink-0">
										<User className="h-6 w-6 text-purple-600" />
									</div>
									<div>
										<h2 className="text-2xl md:text-3xl font-bold text-black mb-4">
											User Accounts
										</h2>
									</div>
								</div>

								<div className="space-y-6 text-gray-700">
									<div>
										<h3 className="text-xl font-semibold text-black mb-3">
											Account Creation
										</h3>
										<p className="leading-relaxed mb-4">
											To access certain features of the Service, you must
											register for an account. When you register, you agree to:
										</p>
										<div className="space-y-3">
											{[
												"Provide accurate, current, and complete information",
												"Maintain and promptly update your account information",
												"Maintain the security of your password and account",
												"Accept responsibility for all activities under your account",
												"Notify us immediately of any unauthorized access",
											].map((item, index) => (
												<div key={index} className="flex gap-3 items-start">
													<div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center shrink-0 text-purple-600 font-bold text-xs mt-0.5">
														{index + 1}
													</div>
													<p className="text-gray-700">{item}</p>
												</div>
											))}
										</div>
									</div>

									<div>
										<h3 className="text-xl font-semibold text-black mb-3">
											Account Termination
										</h3>
										<p className="leading-relaxed">
											We reserve the right to suspend or terminate your account
											if you violate these Terms or engage in any activity that
											we determine, in our sole discretion, is harmful to the
											Service or other users.
										</p>
									</div>

									<div className="bg-orange-50 border border-orange-100 rounded-lg p-4">
										<p className="text-sm text-orange-900">
											<strong>Security Notice:</strong> You are responsible for
											maintaining the confidentiality of your account credentials.
											Never share your password with anyone.
										</p>
									</div>
								</div>
							</div>

							<div
								id="intellectual-property"
								className="bg-white rounded-xl border border-gray-100 p-6 md:p-8 mb-8 shadow-sm"
							>
								<div className="flex items-start gap-4 mb-6">
									<div className="p-2 bg-orange-50 rounded-lg shrink-0">
										<Shield className="h-6 w-6 text-orange-600" />
									</div>
									<div>
										<h2 className="text-2xl md:text-3xl font-bold text-black mb-4">
											Intellectual Property
										</h2>
									</div>
								</div>

								<div className="space-y-6 text-gray-700">
									<div>
										<h3 className="text-xl font-semibold text-black mb-3">
											Our Rights
										</h3>
										<p className="leading-relaxed mb-4">
											The Service and its entire contents, features, and
											functionality (including but not limited to all information,
											software, text, displays, images, video, and audio, and the
											design, selection, and arrangement thereof) are owned by
											Kompa, its licensors, or other providers of such material
											and are protected by copyright, trademark, patent, trade
											secret, and other intellectual property laws.
										</p>
									</div>

									<div>
										<h3 className="text-xl font-semibold text-black mb-3">
											Your Rights
										</h3>
										<p className="leading-relaxed mb-3">
											You retain all rights to any content you submit, post, or
											display on or through the Service. By providing content, you
											grant us a worldwide, non-exclusive, royalty-free license to
											use, reproduce, and display such content in connection with
											operating the Service.
										</p>
									</div>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										{[
											{
												title: "Trademarks",
												desc: "Kompa name and logo are trademarks of Kompa Inc. and may not be used without permission",
											},
											{
												title: "Data Sources",
												desc: "Property data is sourced from licensed providers and public records. Unauthorized redistribution is prohibited",
											},
											{
												title: "API Access",
												desc: "API access and usage is subject to separate API terms and rate limits",
											},
											{
												title: "Third-Party Content",
												desc: "Third-party content is the property of its respective owners and subject to their terms",
											},
										].map((item) => (
											<div
												key={item.title}
												className="p-4 bg-gray-50 rounded-lg border border-gray-100"
											>
												<h4 className="font-semibold text-black mb-2">
													{item.title}
												</h4>
												<p className="text-sm text-gray-600">{item.desc}</p>
											</div>
										))}
									</div>
								</div>
							</div>

							<div className="bg-white rounded-xl border border-gray-100 p-6 md:p-8 mb-8 shadow-sm">
								<h2 className="text-2xl md:text-3xl font-bold text-black mb-6">
									User Content
								</h2>

								<div className="space-y-6 text-gray-700">
									<p className="leading-relaxed">
										You may be able to submit comments, feedback, suggestions, or
										other content through the Service. You represent and warrant
										that:
									</p>

									<div className="space-y-3">
										{[
											"You own or have the necessary rights to your content",
											"Your content does not violate any third-party rights",
											"Your content does not contain viruses or malicious code",
											"Your content complies with all applicable laws",
											"Your content does not contain false or misleading information",
										].map((item) => (
											<div
												key={item}
												className="flex gap-3 items-start p-3 bg-gray-50 rounded-lg"
											>
												<CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
												<p className="text-gray-700">{item}</p>
											</div>
										))}
									</div>

									<p className="text-sm text-gray-600 italic">
										We reserve the right to remove any content that violates
										these Terms or that we find objectionable in our sole
										discretion.
									</p>
								</div>
							</div>

							<div
								id="payment-terms"
								className="bg-white rounded-xl border border-gray-100 p-6 md:p-8 mb-8 shadow-sm"
							>
								<div className="flex items-start gap-4 mb-6">
									<div className="p-2 bg-green-50 rounded-lg shrink-0">
										<CreditCard className="h-6 w-6 text-green-600" />
									</div>
									<div>
										<h2 className="text-2xl md:text-3xl font-bold text-black mb-4">
											Payment Terms
										</h2>
									</div>
								</div>

								<div className="space-y-6 text-gray-700">
									<div>
										<h3 className="text-xl font-semibold text-black mb-3">
											Subscription Plans
										</h3>
										<p className="leading-relaxed mb-4">
											Kompa offers various subscription plans with different
											features and pricing. All fees are quoted in U.S. dollars
											and are non-refundable except as required by law.
										</p>
									</div>

									<div className="grid grid-cols-1 gap-4">
										<div className="p-4 border-l-4 border-blue-600 bg-gray-50">
											<h4 className="font-semibold text-black mb-2">
												Billing Cycle
											</h4>
											<p className="text-sm text-gray-600">
												Subscriptions are billed on a recurring basis (monthly or
												annually) based on your selected plan. Billing occurs on
												the same day each period.
											</p>
										</div>

										<div className="p-4 border-l-4 border-blue-600 bg-gray-50">
											<h4 className="font-semibold text-black mb-2">
												Payment Methods
											</h4>
											<p className="text-sm text-gray-600">
												We accept major credit cards and other payment methods as
												displayed during checkout. You authorize us to charge your
												payment method for all fees.
											</p>
										</div>

										<div className="p-4 border-l-4 border-blue-600 bg-gray-50">
											<h4 className="font-semibold text-black mb-2">
												Automatic Renewal
											</h4>
											<p className="text-sm text-gray-600">
												Your subscription will automatically renew unless you
												cancel before the renewal date. You can cancel anytime
												through your account settings.
											</p>
										</div>

										<div className="p-4 border-l-4 border-blue-600 bg-gray-50">
											<h4 className="font-semibold text-black mb-2">
												Price Changes
											</h4>
											<p className="text-sm text-gray-600">
												We may change subscription prices with at least 30 days'
												notice. Changes will apply to subsequent billing periods.
											</p>
										</div>
									</div>

									<div>
										<h3 className="text-xl font-semibold text-black mb-3">
											Refund Policy
										</h3>
										<p className="leading-relaxed">
											We offer a 14-day money-back guarantee for new subscribers.
											Refund requests must be submitted within 14 days of your
											initial purchase. Renewals are non-refundable.
										</p>
									</div>
								</div>
							</div>

							<div
								id="prohibited-activities"
								className="bg-white rounded-xl border border-gray-100 p-6 md:p-8 mb-8 shadow-sm"
							>
								<div className="flex items-start gap-4 mb-6">
									<div className="p-2 bg-red-50 rounded-lg shrink-0">
										<AlertTriangle className="h-6 w-6 text-red-600" />
									</div>
									<div>
										<h2 className="text-2xl md:text-3xl font-bold text-black mb-4">
											Prohibited Activities
										</h2>
									</div>
								</div>

								<div className="space-y-6 text-gray-700">
									<p className="leading-relaxed">
										You may not access or use the Service for any purpose other
										than that for which we make the Service available. Prohibited
										activities include:
									</p>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										{[
											{
												title: "Unauthorized Access",
												desc: "Attempting to gain unauthorized access to the Service, accounts, or systems",
											},
											{
												title: "Data Scraping",
												desc: "Using automated systems to scrape, extract, or harvest data from the Service",
											},
											{
												title: "Redistribution",
												desc: "Selling, reselling, or redistributing Service data or access to third parties",
											},
											{
												title: "Interference",
												desc: "Interfering with or disrupting the Service or servers or networks",
											},
											{
												title: "Reverse Engineering",
												desc: "Reverse engineering, decompiling, or disassembling any part of the Service",
											},
											{
												title: "Impersonation",
												desc: "Impersonating another person or entity or falsifying information",
											},
											{
												title: "Illegal Activities",
												desc: "Using the Service for any illegal or unauthorized purpose",
											},
											{
												title: "Security Violations",
												desc: "Attempting to probe, scan, or test vulnerabilities of the Service",
											},
										].map((item) => (
											<div
												key={item.title}
												className="p-4 bg-red-50 rounded-lg border border-red-100"
											>
												<div className="flex items-start gap-2 mb-2">
													<AlertTriangle className="h-4 w-4 text-red-600 shrink-0 mt-1" />
													<h4 className="font-semibold text-black">
														{item.title}
													</h4>
												</div>
												<p className="text-sm text-gray-600">{item.desc}</p>
											</div>
										))}
									</div>

									<div className="bg-red-50 border border-red-200 rounded-lg p-4">
										<p className="text-sm text-red-900">
											<strong>Warning:</strong> Violation of these prohibited
											activities may result in immediate account termination and
											potential legal action.
										</p>
									</div>
								</div>
							</div>

							<div className="bg-white rounded-xl border border-gray-100 p-6 md:p-8 mb-8 shadow-sm">
								<h2 className="text-2xl md:text-3xl font-bold text-black mb-6">
									Disclaimers
								</h2>

								<div className="space-y-6 text-gray-700">
									<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
										<h3 className="text-lg font-semibold text-black mb-4">
											AS-IS BASIS
										</h3>
										<p className="leading-relaxed mb-4 text-gray-700">
											THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE"
											BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR
											IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF
											MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE,
											NON-INFRINGEMENT, OR COURSE OF PERFORMANCE.
										</p>
										<p className="leading-relaxed text-gray-700">
											We do not warrant that the Service will be uninterrupted,
											secure, or error-free, or that any defects will be
											corrected. Property data is provided for informational
											purposes and may contain inaccuracies.
										</p>
									</div>

									<div>
										<h3 className="text-xl font-semibold text-black mb-3">
											Data Accuracy
										</h3>
										<p className="leading-relaxed">
											While we strive to provide accurate and up-to-date
											information, we make no representations or warranties about
											the accuracy, reliability, completeness, or timeliness of
											any property data. You should independently verify all
											information before making decisions based on it.
										</p>
									</div>

									<div>
										<h3 className="text-xl font-semibold text-black mb-3">
											Third-Party Links
										</h3>
										<p className="leading-relaxed">
											The Service may contain links to third-party websites or
											services. We are not responsible for the content,
											availability, or practices of any third-party sites.
										</p>
									</div>
								</div>
							</div>

							<div className="bg-white rounded-xl border border-gray-100 p-6 md:p-8 mb-8 shadow-sm">
								<h2 className="text-2xl md:text-3xl font-bold text-black mb-6">
									Limitation of Liability
								</h2>

								<div className="space-y-6 text-gray-700">
									<div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
										<p className="leading-relaxed mb-4 font-semibold text-black">
											TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO
											EVENT SHALL KOMPA, ITS AFFILIATES, DIRECTORS, EMPLOYEES, OR
											LICENSORS BE LIABLE FOR:
										</p>
										<ul className="space-y-3 ml-5 list-disc marker:text-blue-600">
											<li>
												Any indirect, incidental, special, consequential, or
												punitive damages
											</li>
											<li>
												Any loss of profits, revenue, data, use, goodwill, or
												other intangible losses
											</li>
											<li>
												Any damages resulting from your use or inability to use
												the Service
											</li>
											<li>
												Any damages resulting from unauthorized access to or
												alteration of your data
											</li>
											<li>Any damages resulting from third-party content</li>
										</ul>
									</div>

									<p className="text-sm text-gray-600">
										Our total liability to you for all claims arising from or
										related to the Service shall not exceed the amount you paid
										us in the 12 months preceding the claim.
									</p>
								</div>
							</div>

							<div className="bg-white rounded-xl border border-gray-100 p-6 md:p-8 mb-8 shadow-sm">
								<h2 className="text-2xl md:text-3xl font-bold text-black mb-6">
									Indemnification
								</h2>

								<div className="space-y-4 text-gray-700">
									<p className="leading-relaxed">
										You agree to defend, indemnify, and hold harmless Kompa and
										its affiliates, licensors, and service providers from and
										against any claims, liabilities, damages, judgments, awards,
										losses, costs, expenses, or fees (including reasonable
										attorneys' fees) arising out of or relating to:
									</p>
									<ul className="space-y-2 ml-5 list-disc marker:text-blue-600">
										<li>Your violation of these Terms of Service</li>
										<li>Your use or misuse of the Service</li>
										<li>
											Your violation of any law or the rights of a third party
										</li>
										<li>Any content you submit or post through the Service</li>
									</ul>
								</div>
							</div>

							<div className="bg-white rounded-xl border border-gray-100 p-6 md:p-8 mb-8 shadow-sm">
								<h2 className="text-2xl md:text-3xl font-bold text-black mb-6">
									Termination
								</h2>

								<div className="space-y-6 text-gray-700">
									<div>
										<h3 className="text-xl font-semibold text-black mb-3">
											By You
										</h3>
										<p className="leading-relaxed">
											You may terminate your account at any time by contacting us
											or using the account cancellation feature. Upon termination,
											your right to use the Service will immediately cease.
										</p>
									</div>

									<div>
										<h3 className="text-xl font-semibold text-black mb-3">
											By Us
										</h3>
										<p className="leading-relaxed mb-3">
											We may terminate or suspend your account and access to the
											Service immediately, without prior notice or liability, for
											any reason, including:
										</p>
										<ul className="space-y-2 ml-5 list-disc marker:text-blue-600">
											<li>Breach of these Terms</li>
											<li>Non-payment of fees</li>
											<li>Engaging in prohibited activities</li>
											<li>Fraudulent or illegal activity</li>
											<li>At our sole discretion</li>
										</ul>
									</div>

									<div>
										<h3 className="text-xl font-semibold text-black mb-3">
											Effect of Termination
										</h3>
										<p className="leading-relaxed">
											Upon termination, all licenses and rights granted to you
											will immediately terminate. Provisions that by their nature
											should survive termination shall survive, including
											ownership provisions, warranty disclaimers, and limitations
											of liability.
										</p>
									</div>
								</div>
							</div>

							<div className="bg-white rounded-xl border border-gray-100 p-6 md:p-8 mb-8 shadow-sm">
								<h2 className="text-2xl md:text-3xl font-bold text-black mb-6">
									Governing Law & Disputes
								</h2>

								<div className="space-y-6 text-gray-700">
									<div>
										<h3 className="text-xl font-semibold text-black mb-3">
											Governing Law
										</h3>
										<p className="leading-relaxed">
											These Terms shall be governed by and construed in accordance
											with the laws of the United States, without regard to its
											conflict of law provisions.
										</p>
									</div>

									<div>
										<h3 className="text-xl font-semibold text-black mb-3">
											Dispute Resolution
										</h3>
										<p className="leading-relaxed mb-3">
											Most disputes can be resolved through informal negotiation.
											If we cannot resolve a dispute informally, you and Kompa
											agree to resolve disputes through binding arbitration or
											small claims court, rather than lawsuits in general courts.
										</p>
									</div>

									<div>
										<h3 className="text-xl font-semibold text-black mb-3">
											Class Action Waiver
										</h3>
										<p className="leading-relaxed">
											You and Kompa agree that any dispute resolution proceedings
											will be conducted only on an individual basis and not in a
											class, consolidated, or representative action.
										</p>
									</div>
								</div>
							</div>

							<div className="bg-white rounded-xl border border-gray-100 p-6 md:p-8 mb-8 shadow-sm">
								<h2 className="text-2xl md:text-3xl font-bold text-black mb-6">
									Changes to These Terms
								</h2>

								<div className="space-y-4 text-gray-700">
									<p className="leading-relaxed">
										We reserve the right to modify or replace these Terms at any
										time. We will provide notice of material changes by:
									</p>
									<ul className="space-y-2 ml-5 list-disc marker:text-blue-600">
										<li>Posting the updated terms on this page</li>
										<li>Updating the "Last Updated" date at the top</li>
										<li>
											Sending email notification for significant changes
										</li>
									</ul>
									<p className="text-sm text-gray-600 mt-4">
										Your continued use of the Service after any changes
										constitutes acceptance of the new Terms. If you do not agree
										to the new Terms, you must stop using the Service.
									</p>
								</div>
							</div>

							<div className="bg-white rounded-xl border border-gray-100 p-6 md:p-8 mb-8 shadow-sm">
								<h2 className="text-2xl md:text-3xl font-bold text-black mb-6">
									General Provisions
								</h2>

								<div className="space-y-6 text-gray-700">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										{[
											{
												title: "Entire Agreement",
												desc: "These Terms constitute the entire agreement between you and Kompa regarding the Service",
											},
											{
												title: "Severability",
												desc: "If any provision is found unenforceable, the remaining provisions will remain in effect",
											},
											{
												title: "No Waiver",
												desc: "Our failure to enforce any right or provision shall not constitute a waiver of such right",
											},
											{
												title: "Assignment",
												desc: "You may not assign these Terms without our consent. We may assign these Terms at any time",
											},
											{
												title: "Force Majeure",
												desc: "We are not liable for delays or failures due to circumstances beyond our reasonable control",
											},
											{
												title: "Notices",
												desc: "Notices must be sent to the contact information provided and will be deemed given when received",
											},
										].map((item) => (
											<div
												key={item.title}
												className="p-4 bg-gray-50 rounded-lg border border-gray-100"
											>
												<h4 className="font-semibold text-black mb-2">
													{item.title}
												</h4>
												<p className="text-sm text-gray-600">{item.desc}</p>
											</div>
										))}
									</div>
								</div>
							</div>

							<div
								id="contact-us"
								className="bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-100 p-6 md:p-8 shadow-sm"
							>
								<div className="flex items-start gap-4 mb-6">
									<div className="p-2 bg-blue-100 rounded-lg shrink-0">
										<Mail className="h-6 w-6 text-blue-600" />
									</div>
									<div>
										<h2 className="text-2xl md:text-3xl font-bold text-black mb-4">
											Contact Us
										</h2>
									</div>
								</div>

								<div className="space-y-6">
									<p className="leading-relaxed text-gray-700">
										If you have questions about these Terms of Service, please
										contact us:
									</p>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div className="bg-white rounded-lg border border-gray-200 p-4">
											<h4 className="font-semibold text-black mb-2">Email</h4>
											<a
												href="mailto:legal@kompa.com"
												className="text-blue-600 hover:underline"
											>
												info@kompa.com
											</a>
										</div>

										<div className="bg-white rounded-lg border border-gray-200 p-4">
											<h4 className="font-semibold text-black mb-2">Support</h4>
											<a
												href="mailto:support@kompa.com"
												className="text-blue-600 hover:underline"
											>
												info@kompa.com
											</a>
										</div>
									</div>

								

									<p className="text-sm text-gray-600">
										We aim to respond to all inquiries within 5 business days.
									</p>
								</div>
							</div>
						</div>
					</main>
				</div>
			</section>

			<section className="mx-auto max-w-7xl px-6 lg:px-8 py-12 mb-12">
				<div className="bg-[#2a2a2a] rounded-2xl p-8 md:p-12 text-center border border-[#4a4a5c]">
					<h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
						Questions About Our Terms?
					</h3>
					<p className="text-gray-300 mb-6 max-w-2xl mx-auto">
						Our legal team is here to help. Reach out if you have any questions
						or need clarification about our terms of service.
					</p>
					<a
						href="mailto:legal@kompa.com"
						className="inline-block px-8 py-3 bg-white text-[#2a2a2a] font-semibold rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
					>
						Contact Legal Team
					</a>
				</div>
			</section>
		</div>
	);
}
