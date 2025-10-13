/** biome-ignore-all lint/nursery/useSortedClasses: <explanation> */
/** biome-ignore-all lint/correctness/useUniqueElementIds: <explanation> */
import React from "react";
import { Shield, Lock, Eye, Database, Mail, Clock } from "lucide-react";

export default function Privacy() {
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
							<Shield className="h-8 w-8 text-blue-600" />
						</div>
						<div>
							<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black">
								Privacy Policy
							</h1>
						</div>
					</div>
					<p className="text-lg md:text-xl text-gray-600 max-w-3xl">
						Your privacy is important to us. This policy explains how Kompa
						collects, uses, and protects your personal information.
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
										{ icon: Eye, label: "Information We Collect" },
										{ icon: Database, label: "How We Use Data" },
										{ icon: Lock, label: "Data Protection" },
										{ icon: Shield, label: "Your Rights" },
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
								id="information-we-collect"
								className="bg-white rounded-xl border border-gray-100 p-6 md:p-8 mb-8 shadow-sm"
							>
								<div className="flex items-start gap-4 mb-6">
									<div className="p-2 bg-blue-50 rounded-lg shrink-0">
										<Eye className="h-6 w-6 text-blue-600" />
									</div>
									<div>
										<h2 className="text-2xl md:text-3xl font-bold text-black mb-4">
											Information We Collect
										</h2>
									</div>
								</div>

								<div className="space-y-6 text-gray-700">
									<div>
										<h3 className="text-xl font-semibold text-black mb-3">
											Personal Information
										</h3>
										<p className="leading-relaxed mb-3">
											When you use Kompa, we may collect the following types of
											personal information:
										</p>
										<ul className="space-y-2 ml-5 list-disc marker:text-blue-600">
											<li>
												<strong>Account Information:</strong> Name, email
												address, phone number, and password when you create an
												account
											</li>
											<li>
												<strong>Profile Data:</strong> Professional information,
												company details, and license numbers (for real estate
												professionals)
											</li>
											<li>
												<strong>Payment Information:</strong> Billing address and
												payment method details (processed securely through
												third-party payment processors)
											</li>
											<li>
												<strong>Communications:</strong> Messages, feedback, and
												support requests you send to us
											</li>
										</ul>
									</div>

									<div>
										<h3 className="text-xl font-semibold text-black mb-3">
											Usage Data
										</h3>
										<p className="leading-relaxed mb-3">
											We automatically collect information about how you interact
											with our platform:
										</p>
										<ul className="space-y-2 ml-5 list-disc marker:text-blue-600">
											<li>
												Search queries and property addresses you look up
											</li>
											<li>
												Pages visited, features used, and time spent on the
												platform
											</li>
											<li>
												Device information (browser type, operating system, IP
												address)
											</li>
											<li>Cookies and similar tracking technologies</li>
										</ul>
									</div>

									<div>
										<h3 className="text-xl font-semibold text-black mb-3">
											Property Data
										</h3>
										<p className="leading-relaxed">
											Information about properties you search for, save, or
											analyze, including property details, comparable sales data,
											and market analytics.
										</p>
									</div>
								</div>
							</div>

							<div
								id="how-we-use-data"
								className="bg-white rounded-xl border border-gray-100 p-6 md:p-8 mb-8 shadow-sm"
							>
								<div className="flex items-start gap-4 mb-6">
									<div className="p-2 bg-green-50 rounded-lg shrink-0">
										<Database className="h-6 w-6 text-green-600" />
									</div>
									<div>
										<h2 className="text-2xl md:text-3xl font-bold text-black mb-4">
											How We Use Your Data
										</h2>
									</div>
								</div>

								<div className="space-y-6 text-gray-700">
									<p className="leading-relaxed">
										We use your information for the following purposes:
									</p>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										{[
											{
												title: "Service Delivery",
												desc: "Provide access to property data, comparables, and market insights",
											},
											{
												title: "Account Management",
												desc: "Create and maintain your account, process payments, and provide support",
											},
											{
												title: "Platform Improvement",
												desc: "Analyze usage patterns to enhance features and user experience",
											},
											{
												title: "Communication",
												desc: "Send service updates, notifications, and promotional materials (with your consent)",
											},
											{
												title: "Security",
												desc: "Detect and prevent fraud, abuse, and security threats",
											},
											{
												title: "Legal Compliance",
												desc: "Comply with legal obligations and enforce our terms of service",
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
								id="data-protection"
								className="bg-white rounded-xl border border-gray-100 p-6 md:p-8 mb-8 shadow-sm"
							>
								<div className="flex items-start gap-4 mb-6">
									<div className="p-2 bg-purple-50 rounded-lg shrink-0">
										<Lock className="h-6 w-6 text-purple-600" />
									</div>
									<div>
										<h2 className="text-2xl md:text-3xl font-bold text-black mb-4">
											Data Protection & Security
										</h2>
									</div>
								</div>

								<div className="space-y-6 text-gray-700">
									<p className="leading-relaxed">
										We implement industry-standard security measures to protect
										your personal information:
									</p>

									<div className="space-y-4">
										<div className="flex gap-4 items-start">
											<div className="w-2 h-2 bg-blue-600 rounded-full mt-2 shrink-0" />
											<div>
												<h4 className="font-semibold text-black mb-1">
													Encryption
												</h4>
												<p className="text-gray-600">
													All data transmitted between your device and our
													servers is encrypted using SSL/TLS protocols
												</p>
											</div>
										</div>

										<div className="flex gap-4 items-start">
											<div className="w-2 h-2 bg-blue-600 rounded-full mt-2 shrink-0" />
											<div>
												<h4 className="font-semibold text-black mb-1">
													Access Controls
												</h4>
												<p className="text-gray-600">
													Strict access controls and authentication measures to
													prevent unauthorized access to your data
												</p>
											</div>
										</div>

										<div className="flex gap-4 items-start">
											<div className="w-2 h-2 bg-blue-600 rounded-full mt-2 shrink-0" />
											<div>
												<h4 className="font-semibold text-black mb-1">
													Regular Audits
												</h4>
												<p className="text-gray-600">
													Periodic security audits and vulnerability assessments
													to maintain high security standards
												</p>
											</div>
										</div>

										<div className="flex gap-4 items-start">
											<div className="w-2 h-2 bg-blue-600 rounded-full mt-2 shrink-0" />
											<div>
												<h4 className="font-semibold text-black mb-1">
													Data Minimization
												</h4>
												<p className="text-gray-600">
													We only collect and retain data that is necessary for
													our services
												</p>
											</div>
										</div>
									</div>

									<div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mt-6">
										<p className="text-sm text-blue-900">
											<strong>Note:</strong> While we take extensive measures to
											protect your data, no method of transmission over the
											internet is 100% secure. Please use strong passwords and
											keep your account credentials confidential.
										</p>
									</div>
								</div>
							</div>

							<div className="bg-white rounded-xl border border-gray-100 p-6 md:p-8 mb-8 shadow-sm">
								<h2 className="text-2xl md:text-3xl font-bold text-black mb-6">
									Data Sharing & Third Parties
								</h2>

								<div className="space-y-6 text-gray-700">
									<p className="leading-relaxed">
										We may share your information with third parties in the
										following circumstances:
									</p>

									<div className="space-y-4">
										<div className="p-4 border-l-4 border-blue-600 bg-gray-50">
											<h4 className="font-semibold text-black mb-2">
												Service Providers
											</h4>
											<p className="text-sm text-gray-600">
												Trusted third-party vendors who help us operate our
												platform (hosting, payment processing, analytics)
											</p>
										</div>

										<div className="p-4 border-l-4 border-blue-600 bg-gray-50">
											<h4 className="font-semibold text-black mb-2">
												Data Providers
											</h4>
											<p className="text-sm text-gray-600">
												We source property data from licensed data providers and
												public records
											</p>
										</div>

										<div className="p-4 border-l-4 border-blue-600 bg-gray-50">
											<h4 className="font-semibold text-black mb-2">
												Legal Requirements
											</h4>
											<p className="text-sm text-gray-600">
												When required by law, court order, or government
												regulation
											</p>
										</div>

										<div className="p-4 border-l-4 border-blue-600 bg-gray-50">
											<h4 className="font-semibold text-black mb-2">
												Business Transfers
											</h4>
											<p className="text-sm text-gray-600">
												In connection with a merger, acquisition, or sale of
												assets
											</p>
										</div>
									</div>

									<p className="text-sm text-gray-600 italic">
										We do not sell your personal information to third parties for
										their marketing purposes.
									</p>
								</div>
							</div>

							<div
								id="your-rights"
								className="bg-white rounded-xl border border-gray-100 p-6 md:p-8 mb-8 shadow-sm"
							>
								<div className="flex items-start gap-4 mb-6">
									<div className="p-2 bg-orange-50 rounded-lg shrink-0">
										<Shield className="h-6 w-6 text-orange-600" />
									</div>
									<div>
										<h2 className="text-2xl md:text-3xl font-bold text-black mb-4">
											Your Privacy Rights
										</h2>
									</div>
								</div>

								<div className="space-y-6 text-gray-700">
									<p className="leading-relaxed">
										You have the following rights regarding your personal data:
									</p>

									<div className="grid grid-cols-1 gap-4">
										{[
											{
												title: "Access",
												desc: "Request a copy of the personal information we hold about you",
											},
											{
												title: "Correction",
												desc: "Request corrections to inaccurate or incomplete information",
											},
											{
												title: "Deletion",
												desc: "Request deletion of your personal data (subject to legal obligations)",
											},
											{
												title: "Portability",
												desc: "Receive your data in a structured, machine-readable format",
											},
											{
												title: "Opt-Out",
												desc: "Unsubscribe from marketing communications at any time",
											},
											{
												title: "Restriction",
												desc: "Request that we limit how we use your information",
											},
										].map((right) => (
											<div
												key={right.title}
												className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100"
											>
												<div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center shrink-0 text-orange-600 font-bold text-sm">
													✓
												</div>
												<div>
													<h4 className="font-semibold text-black mb-1">
														{right.title}
													</h4>
													<p className="text-sm text-gray-600">{right.desc}</p>
												</div>
											</div>
										))}
									</div>

									<div className="bg-orange-50 border border-orange-100 rounded-lg p-4 mt-6">
										<p className="text-sm text-orange-900">
											To exercise any of these rights, please contact us at{" "}
											<a
												href="mailto:privacy@kompa.com"
												className="font-semibold underline"
											>
												privacy@kompa.com
											</a>
											. We will respond to your request within 30 days.
										</p>
									</div>
								</div>
							</div>

							<div className="bg-white rounded-xl border border-gray-100 p-6 md:p-8 mb-8 shadow-sm">
								<h2 className="text-2xl md:text-3xl font-bold text-black mb-6">
									Cookies & Tracking
								</h2>

								<div className="space-y-6 text-gray-700">
									<p className="leading-relaxed">
										We use cookies and similar technologies to enhance your
										experience. Cookies are small text files stored on your device
										that help us:
									</p>

									<ul className="space-y-2 ml-5 list-disc marker:text-blue-600">
										<li>Remember your preferences and settings</li>
										<li>Understand how you use our platform</li>
										<li>Improve our services and features</li>
										<li>Provide personalized content</li>
									</ul>

									<div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
										<h4 className="font-semibold text-black mb-3">
											Types of Cookies We Use:
										</h4>
										<div className="space-y-2 text-sm">
											<div className="flex justify-between items-start py-2 border-b border-gray-200">
												<span className="font-medium text-black">
													Essential Cookies
												</span>
												<span className="text-gray-600 text-right">
													Required for basic functionality
												</span>
											</div>
											<div className="flex justify-between items-start py-2 border-b border-gray-200">
												<span className="font-medium text-black">
													Analytics Cookies
												</span>
												<span className="text-gray-600 text-right">
													Track usage and performance
												</span>
											</div>
											<div className="flex justify-between items-start py-2">
												<span className="font-medium text-black">
													Preference Cookies
												</span>
												<span className="text-gray-600 text-right">
													Remember your settings
												</span>
											</div>
										</div>
									</div>

									<p className="text-sm text-gray-600">
										You can control cookies through your browser settings.
										However, disabling cookies may affect your ability to use
										certain features.
									</p>
								</div>
							</div>

							<div className="bg-white rounded-xl border border-gray-100 p-6 md:p-8 mb-8 shadow-sm">
								<h2 className="text-2xl md:text-3xl font-bold text-black mb-6">
									Children's Privacy
								</h2>

								<div className="space-y-4 text-gray-700">
									<p className="leading-relaxed">
										Kompa is not intended for use by individuals under the age of
										18. We do not knowingly collect personal information from
										children. If you believe we have inadvertently collected
										information from a child, please contact us immediately.
									</p>
								</div>
							</div>

							<div className="bg-white rounded-xl border border-gray-100 p-6 md:p-8 mb-8 shadow-sm">
								<h2 className="text-2xl md:text-3xl font-bold text-black mb-6">
									International Data Transfers
								</h2>

								<div className="space-y-4 text-gray-700">
									<p className="leading-relaxed">
										Your information may be transferred to and processed in
										countries other than your own. We ensure appropriate
										safeguards are in place to protect your data in accordance
										with applicable data protection laws, including GDPR and CCPA
										compliance where applicable.
									</p>
								</div>
							</div>

							<div className="bg-white rounded-xl border border-gray-100 p-6 md:p-8 mb-8 shadow-sm">
								<h2 className="text-2xl md:text-3xl font-bold text-black mb-6">
									Data Retention
								</h2>

								<div className="space-y-4 text-gray-700">
									<p className="leading-relaxed mb-4">
										We retain your personal information for as long as necessary
										to:
									</p>
									<ul className="space-y-2 ml-5 list-disc marker:text-blue-600">
										<li>Provide our services to you</li>
										<li>Comply with legal obligations</li>
										<li>Resolve disputes and enforce agreements</li>
										<li>
											Maintain business records for legitimate business purposes
										</li>
									</ul>
									<p className="text-sm text-gray-600 mt-4">
										When you delete your account, we will remove or anonymize
										your personal data within 90 days, unless we are required by
										law to retain it longer.
									</p>
								</div>
							</div>

							<div className="bg-white rounded-xl border border-gray-100 p-6 md:p-8 mb-8 shadow-sm">
								<h2 className="text-2xl md:text-3xl font-bold text-black mb-6">
									Changes to This Policy
								</h2>

								<div className="space-y-4 text-gray-700">
									<p className="leading-relaxed">
										We may update this Privacy Policy from time to time. We will
										notify you of any material changes by:
									</p>
									<ul className="space-y-2 ml-5 list-disc marker:text-blue-600">
										<li>Posting the updated policy on this page</li>
										<li>Updating the "Last Updated" date at the top</li>
										<li>
											Sending you an email notification (for significant changes)
										</li>
									</ul>
									<p className="text-sm text-gray-600 mt-4">
										Your continued use of Kompa after changes are posted
										constitutes acceptance of the updated policy.
									</p>
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
										If you have questions, concerns, or requests regarding this
										Privacy Policy or how we handle your data, please contact us:
									</p>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div className="bg-white rounded-lg border border-gray-200 p-4">
											<h4 className="font-semibold text-black mb-2">Email</h4>
											<a
												href="mailto:privacy@kompa.com"
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
										We aim to respond to all privacy-related inquiries within 5
										business days.
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
						Questions About Your Privacy?
					</h3>
					<p className="text-gray-300 mb-6 max-w-2xl mx-auto">
						Our team is here to help. Reach out anytime with questions or
						concerns about how we protect your data.
					</p>
					<a
						href="mailto:privacy@kompa.com"
						className="inline-block px-8 py-3 bg-white text-[#2a2a2a] font-semibold rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
					>
						Contact Privacy Team
					</a>
				</div>
			</section>
		</div>
	);
}
