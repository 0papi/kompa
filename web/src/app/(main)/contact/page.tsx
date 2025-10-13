/** biome-ignore-all lint/nursery/useSortedClasses: <explanation> */
import React from "react";
import { Mail, MapPin, Phone, Clock, Send, MessageSquare } from "lucide-react";

export default function Contact() {
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
							<MessageSquare className="h-8 w-8 text-blue-600" />
						</div>
						<div>
							<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black">
								Get in Touch
							</h1>
						</div>
					</div>
					<p className="text-lg md:text-xl text-gray-600 max-w-3xl leading-relaxed">
						Have a question or need assistance? Our team is here to help you
						find the property data you need.
					</p>
				</div>
			</section>

			<section className="mx-auto max-w-7xl px-6 lg:px-8 py-16 md:py-20">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
					<div className="lg:col-span-2">
						<div className="bg-white rounded-2xl border border-gray-200 p-8 md:p-10">
							<div className="mb-8">
								<h2 className="text-2xl md:text-3xl font-bold text-black mb-2">
									Send Us a Message
								</h2>
								<p className="text-gray-600">
									Fill out the form below and we'll get back to you within 24
									hours.
								</p>
							</div>

							<form className="space-y-6">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div>
										<label
											htmlFor="firstName"
											className="block text-sm font-semibold text-black mb-2"
										>
											First Name
										</label>
										<input
											type="text"
											id="firstName"
											name="firstName"
											className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
											placeholder="John"
										/>
									</div>

									<div>
										<label
											htmlFor="lastName"
											className="block text-sm font-semibold text-black mb-2"
										>
											Last Name
										</label>
										<input
											type="text"
											id="lastName"
											name="lastName"
											className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
											placeholder="Doe"
										/>
									</div>
								</div>

								<div>
									<label
										htmlFor="email"
										className="block text-sm font-semibold text-black mb-2"
									>
										Email Address
									</label>
									<input
										type="email"
										id="email"
										name="email"
										className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
										placeholder="john@example.com"
									/>
								</div>

								<div>
									<label
										htmlFor="phone"
										className="block text-sm font-semibold text-black mb-2"
									>
										Phone Number{" "}
										<span className="text-gray-400 font-normal">(Optional)</span>
									</label>
									<input
										type="tel"
										id="phone"
										name="phone"
										className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
										placeholder="+1 (555) 000-0000"
									/>
								</div>

								<div>
									<label
										htmlFor="subject"
										className="block text-sm font-semibold text-black mb-2"
									>
										Subject
									</label>
									<select
										id="subject"
										name="subject"
										className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all bg-white"
									>
										<option value="">Select a subject</option>
										<option value="general">General Inquiry</option>
										<option value="support">Technical Support</option>
										<option value="sales">Sales Question</option>
										<option value="billing">Billing Issue</option>
										<option value="feature">Feature Request</option>
										<option value="partnership">Partnership Opportunity</option>
										<option value="other">Other</option>
									</select>
								</div>

								<div>
									<label
										htmlFor="message"
										className="block text-sm font-semibold text-black mb-2"
									>
										Message
									</label>
									<textarea
										id="message"
										name="message"
										rows={6}
										className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all resize-none"
										placeholder="Tell us how we can help you..."
									/>
								</div>

								<div className="flex items-start gap-3">
									<input
										type="checkbox"
										id="consent"
										name="consent"
										className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
									/>
									<label htmlFor="consent" className="text-sm text-gray-600">
										I agree to receive communications from Kompa and understand
										that I can opt out at any time. See our{" "}
										<a href="/privacy" className="text-blue-600 hover:underline">
											Privacy Policy
										</a>
										.
									</label>
								</div>

								<button
									type="submit"
									className="w-full md:w-auto px-8 py-3 bg-[#2a2a2a] text-white font-semibold rounded-lg border border-[#4a4a5c] hover:bg-[#323232] transition-colors flex items-center justify-center gap-2"
								>
									<Send className="h-5 w-5" />
									Send Message
								</button>
							</form>
						</div>
					</div>

					<div className="lg:col-span-1 space-y-6">
						<div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl border border-blue-100 p-8">
							<div className="flex items-center gap-3 mb-6">
								<div className="p-2 bg-blue-100 rounded-lg">
									<Mail className="h-6 w-6 text-blue-600" />
								</div>
								<h3 className="text-xl font-bold text-black">Email Us</h3>
							</div>
							<div className="space-y-3">
								<div>
									<div className="text-sm text-gray-600 mb-1">General</div>
									<a
										href="mailto:info@kompa.com"
										className="text-blue-600 hover:underline font-medium"
									>
										info@kompa.com
									</a>
								</div>
								<div>
									<div className="text-sm text-gray-600 mb-1">Support</div>
									<a
										href="mailto:support@kompa.com"
										className="text-blue-600 hover:underline font-medium"
									>
										info@kompa.com
									</a>
								</div>
								<div>
									<div className="text-sm text-gray-600 mb-1">Sales</div>
									<a
										href="mailto:sales@kompa.com"
										className="text-blue-600 hover:underline font-medium"
									>
										info@kompa.com
									</a>
								</div>
							</div>
						</div>

						<div className="bg-gradient-to-br from-green-50 to-white rounded-2xl border border-green-100 p-8">
							<div className="flex items-center gap-3 mb-6">
								<div className="p-2 bg-green-100 rounded-lg">
									<Clock className="h-6 w-6 text-green-600" />
								</div>
								<h3 className="text-xl font-bold text-black">Office Hours</h3>
							</div>
							<div className="space-y-3 text-gray-700">
								<div className="flex justify-between">
									<span className="text-gray-600">Monday - Friday</span>
									<span className="font-semibold">9AM - 6PM EST</span>
								</div>
								<div className="flex justify-between">
									<span className="text-gray-600">Saturday</span>
									<span className="font-semibold">10AM - 4PM EST</span>
								</div>
								<div className="flex justify-between">
									<span className="text-gray-600">Sunday</span>
									<span className="font-semibold">Closed</span>
								</div>
							</div>
							<div className="mt-6 pt-6 border-t border-green-100">
								<p className="text-sm text-gray-600">
									24/7 support available for enterprise customers
								</p>
							</div>
						</div>

						<div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl border border-purple-100 p-8">
							<div className="flex items-center gap-3 mb-6">
								<div className="p-2 bg-purple-100 rounded-lg">
									<MapPin className="h-6 w-6 text-purple-600" />
								</div>
								<h3 className="text-xl font-bold text-black">Visit Us</h3>
							</div>
							<address className="not-italic text-gray-700 leading-relaxed">
								Kompa Inc.
								<br />
								[Your Street Address]
								<br />
								[City, State ZIP]
								<br />
								United States
							</address>
						</div>

						<div className="bg-gradient-to-br from-orange-50 to-white rounded-2xl border border-orange-100 p-8">
							<div className="flex items-center gap-3 mb-6">
								<div className="p-2 bg-orange-100 rounded-lg">
									<Phone className="h-6 w-6 text-orange-600" />
								</div>
								<h3 className="text-xl font-bold text-black">Call Us</h3>
							</div>
							<div className="space-y-3">
								<div>
									<div className="text-sm text-gray-600 mb-1">Main Office</div>
									<a
										href="tel:+15551234567"
										className="text-orange-600 hover:underline font-medium text-lg"
									>
										+1 (555) 123-4567
									</a>
								</div>
								<div>
									<div className="text-sm text-gray-600 mb-1">Support</div>
									<a
										href="tel:+15551234568"
										className="text-orange-600 hover:underline font-medium text-lg"
									>
										+1 (555) 123-4568
									</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="bg-gray-50 py-16 md:py-20">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="text-center mb-12">
						<h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
							Frequently Asked Questions
						</h2>
						<p className="text-lg text-gray-600 max-w-2xl mx-auto">
							Quick answers to common questions. Can't find what you're looking
							for? Contact us directly.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
						{[
							{
								question: "How quickly will I receive a response?",
								answer:
									"We typically respond to all inquiries within 24 hours during business days. For urgent matters, please call our support line.",
							},
							{
								question: "Do you offer demos or product tours?",
								answer:
									"Yes! We offer personalized demos for teams and businesses. Select 'Sales Question' in the form above to schedule a demo.",
							},
							{
								question: "What are your support hours?",
								answer:
									"Our support team is available Monday-Friday 9AM-6PM EST, and Saturday 10AM-4PM EST. Enterprise customers have 24/7 support access.",
							},
							{
								question: "Can I schedule a call with your team?",
								answer:
									"Absolutely! Include your preferred time and date in your message, and we'll coordinate a call that works for you.",
							},
							{
								question: "Do you have a physical office?",
								answer:
									"Yes, our main office is located in [City, State]. We welcome visitors by appointment—please contact us to schedule.",
							},
							{
								question: "How do I report a technical issue?",
								answer:
									"For technical issues, select 'Technical Support' as your subject and provide as much detail as possible. Include screenshots if applicable.",
							},
						].map((faq, index) => (
							<div
								key={index}
								className="bg-white rounded-xl border border-gray-200 p-6 hover:border-blue-200 transition-colors"
							>
								<h3 className="text-lg font-bold text-black mb-3">
									{faq.question}
								</h3>
								<p className="text-gray-600 leading-relaxed">{faq.answer}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			<section className="mx-auto max-w-7xl px-6 lg:px-8 py-16 md:py-20">
				<div className="bg-white rounded-2xl border border-gray-200 p-8 md:p-12">
					<div className="text-center mb-12">
						<h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
							Other Ways to Connect
						</h2>
						<p className="text-lg text-gray-600">
							Choose the communication method that works best for you
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						<div className="text-center">
							<div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
								<MessageSquare className="h-8 w-8 text-blue-600" />
							</div>
							<h3 className="text-lg font-bold text-black mb-2">
								Live Chat
							</h3>
							<p className="text-sm text-gray-600 mb-4">
								Get instant answers from our support team
							</p>
							<button
								type="button"
								className="text-blue-600 hover:underline font-semibold text-sm"
							>
								Start Chat →
							</button>
						</div>

						<div className="text-center">
							<div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
								<Mail className="h-8 w-8 text-green-600" />
							</div>
							<h3 className="text-lg font-bold text-black mb-2">
								Help Center
							</h3>
							<p className="text-sm text-gray-600 mb-4">
								Browse articles and guides in our knowledge base
							</p>
							<a
								href="/help"
								className="text-green-600 hover:underline font-semibold text-sm"
							>
								Visit Help Center →
							</a>
						</div>

						<div className="text-center">
							<div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
								<Phone className="h-8 w-8 text-purple-600" />
							</div>
							<h3 className="text-lg font-bold text-black mb-2">
								Schedule Call
							</h3>
							<p className="text-sm text-gray-600 mb-4">
								Book a time that works for your schedule
							</p>
							<a
								href="/schedule"
								className="text-purple-600 hover:underline font-semibold text-sm"
							>
								Book Appointment →
							</a>
						</div>
					</div>
				</div>
			</section>

			<section className="mx-auto max-w-7xl px-6 lg:px-8 py-12 mb-12">
				<div className="bg-[#2a2a2a] rounded-2xl p-8 md:p-12 text-center border border-[#4a4a5c]">
					<h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
						Need Immediate Assistance?
					</h3>
					<p className="text-gray-300 mb-6 max-w-2xl mx-auto">
						For urgent matters, our support team is available by phone during
						business hours. We're here to help!
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<a
							href="tel:+15551234568"
							className="inline-block px-8 py-3 bg-white text-[#2a2a2a] font-semibold rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
						>
							Call Support Now
						</a>
						<a
							href="#contact-form"
							className="inline-block px-8 py-3 bg-transparent text-white font-semibold rounded-lg border border-[#4a4a5c] hover:bg-[#323232] transition-colors"
						>
							Send Message
						</a>
					</div>
				</div>
			</section>
		</div>
	);
}
