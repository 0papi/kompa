import { MarketplaceListingDetail } from "@/components/marketplace/marketplace-listing-detail";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";

export const metadata = {
  title: "Marketplace Listing",
};

export default async function MarketplaceListingPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const listingId = params?.listingId;
  return (
    <Suspense fallback={<Loader2 className="animate-spin" />}>
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <MarketplaceListingDetail listingId={listingId as string} />
      </div>
    </Suspense>
  );
}
