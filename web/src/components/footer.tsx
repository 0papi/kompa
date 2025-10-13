/** biome-ignore-all lint/nursery/useSortedClasses: <explanation> */
import Link from "next/link";

export default function Footer() {
	return (
		<footer className="relative w-full bg-[#0a0a0a] text-gray-400">
			{/* Main content */}
			<div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
				<div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
					{/* Brand */}
					<div>
						<h3 className="text-xl font-semibold text-white">Kompa</h3>
						<p className="mt-4 max-w-xs text-sm leading-6">
							The property data marketplace. Find, verify, and connect the data
							that powers real decisions.
						</p>
					</div>

					{/* Marketplace */}
					<div>
						<h4 className="text-sm font-semibold text-white">Marketplace</h4>
						<ul className="mt-4 space-y-2 text-sm">
							<li>
								<Link
									href="/search"
									className="hover:text-white transition-colors"
								>
									Search Data
								</Link>
							</li>
							<li>
								<Link
									href="/signup"
									className="hover:text-white transition-colors"
								>
									List Your Data
								</Link>
							</li>

							<li>
								<Link
									href="/api-access"
									className="hover:text-white transition-colors"
								>
									API Access
								</Link>
							</li>
						</ul>
					</div>

					{/* Company */}
					<div>
						<h4 className="text-sm font-semibold text-white">Company</h4>
						<ul className="mt-4 space-y-2 text-sm">
							<li>
								<Link
									href="/about"
									className="hover:text-white transition-colors"
								>
									About
								</Link>
							</li>
							<li>
								<Link
									href="/blog"
									className="hover:text-white transition-colors"
								>
									Blog
								</Link>
							</li>
							<li>
								<Link
									href="/contact"
									className="hover:text-white transition-colors"
								>
									Contact
								</Link>
							</li>
						</ul>
					</div>

					{/* Legal */}
					<div>
						<h4 className="text-sm font-semibold text-white">Legal</h4>
						<ul className="mt-4 space-y-2 text-sm">
							<li>
								<Link
									href="/privacy"
									className="hover:text-white transition-colors"
								>
									Privacy Policy
								</Link>
							</li>
							<li>
								<Link
									href="/terms"
									className="hover:text-white transition-colors"
								>
									Terms of Use
								</Link>
							</li>
						</ul>
					</div>
				</div>
			</div>

			{/* Divider */}
			<div className="border-t border-gray-800" />

			{/* Bottom bar */}
			<div className="mx-auto max-w-7xl px-6 py-6 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-500">
				<p>© {new Date().getFullYear()} Kompa. All rights reserved.</p>
				<p className="mt-2 sm:mt-0">
					Built for clarity, speed, and verified data.
				</p>
			</div>
		</footer>
	);
}
