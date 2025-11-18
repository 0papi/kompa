import { listingsApi } from "@/lib/api/listings";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface MarketplaceListingDetailProps {
  listingId: string;
}

export async function listingDetailMetadata({
  listingId,
}: MarketplaceListingDetailProps): Promise<Metadata> {
  try {
    const response = await listingsApi.getPublicListingById(listingId);
    const listing = response?.data;

    if (!listing) {
      return notFound();
    }

    const title = `${listing.title} - ${listing.city}, ${listing.state}`;
    const primaryImageUrl =
      listing?.images &&
      listing.images?.find((image) => image.isPrimary)?.imageUrl;
    const description = `${listing.bedrooms} bed, ${listing.bathrooms} bath property in ${listing.city}, ${listing.state}. ${listing.squareFeet.toLocaleString()} sq ft. Price: GH₵${listing.comparablePrice}`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "website",
        //@ts-ignore
        images:
          listing.images && listing.images.length > 0
            ? [
                {
                  url: primaryImageUrl,
                  width: 1200,
                  height: 630,
                  alt: listing.title,
                },
              ]
            : [],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        //@ts-ignore
        images:
          listing.images && listing.images.length > 0 ? [primaryImageUrl] : [],
      },
      //@ts-ignore
      keywords: [
        listing.city,
        listing.state,
        listing.propertyType,
        listing.propertyCategory,
        "real estate",
        "property",
        listing.bedrooms && `${listing.bedrooms} bedroom`,
      ].filter(Boolean),
      alternates: {
        canonical: `/marketplace/listing?listingId=${listingId}`,
      },
    };
  } catch (error) {
    return {
      title: "Property Listing",
      description: "View property details on our marketplace",
    };
  }
}
