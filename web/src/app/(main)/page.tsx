
import DataConsumers from "@/components/sections/data-consumers";
import DataProviders from "@/components/sections/data-providers";
import FaqSection from "@/components/sections/faq";
import Features from "@/components/sections/features";
import Hero from "@/components/sections/hero";



export default function Home() {
	return (
		<div>
		<Hero />
		<Features />
		<DataProviders />
		<DataConsumers />
		<FaqSection />
		</div>
	);
}


