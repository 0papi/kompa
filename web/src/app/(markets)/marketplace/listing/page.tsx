import { MarketplaceListingDetail } from "@/components/marketplace/marketplace-listing-detail";

export default async function MarketplaceListingPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const listingId = params?.listingId;
  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <MarketplaceListingDetail listingId={listingId as string} />
    </div>
  );
}
