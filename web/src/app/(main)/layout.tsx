import Header from "@/components/header";
import Footer from "@/components/footer";

export default function MainLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div>
			<Header />
			<main className="pt-16">{children}</main>
			<Footer />
		</div>
	);
}
