import type { Listing } from "@/lib/api/listings";
import React, { useState, type JSX } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Share2 } from "lucide-react";

interface ShareListingCardProps {
  listing: Listing;
}

const Icon = ({
  type,
  className = "h-4 w-4",
}: {
  type: string;
  className?: string;
}) => {
  const icons: Record<string, JSX.Element> = {
    share: <Share2 />,
    copy: (
      <svg
        className={className}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
        />
      </svg>
    ),
    check: (
      <svg
        className={className}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 13l4 4L19 7"
        />
      </svg>
    ),
    mail: (
      <svg
        className={className}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
    message: (
      <svg
        className={className}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
    ),
    twitter: (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7" />
      </svg>
    ),
    facebook: (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M18 2h-3a6 6 0 00-6 6v3H7v4h2v8h4v-8h3l1-4h-4V8a1 1 0 011-1h3z" />
      </svg>
    ),
    globe: (
      <svg
        className={className}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20H7m6-4h6"
        />
      </svg>
    ),
    bed: (
      <svg
        className={className}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9m-9 5h4"
        />
      </svg>
    ),
    bath: (
      <svg
        className={className}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
    home: (
      <svg
        className={className}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9m-9 16l-7-4m0 0l-2-1m16 3l7-4m0 0l2-1M9 20l0-5m6 0l0-5"
        />
      </svg>
    ),
    dollar: (
      <svg
        className={className}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  };
  return icons[type] || null;
};

export default function ShareListingCard({ listing }: ShareListingCardProps) {
  const baseUrl = process.env.NEXT_PUBLIC_WEB_URL;

  const [copied, setCopied] = useState(false);

  const listingUrl = `${baseUrl}/marketplace/listing?listingId=${listing.id}`;
  const shareTitle = `${listing.title} - ${listing.city}, ${listing.state}`;
  const shareDescription = `${listing.bedrooms}bd, ${listing.bathrooms}ba • ${listing.squareFeet.toLocaleString()} sqft • GH₵${parseFloat(listing.price).toLocaleString()}`;
  //@ts-ignore - images are a relation
  const imageUrl = listing.images?.[0]?.imageUrl || `${baseUrl}/og-image.jpg`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(listingUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link", err);
    }
  };

  const shareOptions = [
    {
      name: "Email",
      icon: "mail",
      action: () => {
        const subject = `Check out this property: ${shareTitle}`;
        const body = `I found this property listing:\n\n${shareTitle}\n\n${shareDescription}\n\nView more: ${listingUrl}`;
        window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      },
    },
    {
      name: "WhatsApp",
      icon: "message",
      action: () => {
        const text = `${shareTitle}\n${shareDescription}\n${listingUrl}`;
        window.open(
          `https://wa.me/?text=${encodeURIComponent(text)}`,
          "_blank",
        );
      },
    },
    {
      name: "Twitter",
      icon: "twitter",
      action: () => {
        const text = `${shareTitle} - ${shareDescription}`;
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(listingUrl)}`,
          "_blank",
        );
      },
    },
    {
      name: "Facebook",
      icon: "facebook",
      action: () => {
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(listingUrl)}`,
          "_blank",
        );
      },
    },
    {
      name: "Copy Link",
      icon: "copy",
      action: handleCopyLink,
    },
  ];

  return (
    <div className="w-full">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="gap-2">
            <Icon type="share" className="h-4 w-4" />
            Share Comparable
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          {/* Preview Section */}
          <div className="p-4 border-b">
            <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
              Preview
            </p>
            <div className="bg-card rounded-lg border overflow-hidden">
              {/* Preview Image */}
              <div className="relative h-32 bg-muted overflow-hidden">
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>

              {/* Preview Content */}
              <div className="p-3 space-y-2">
                <h3 className="font-semibold text-sm text-foreground line-clamp-2">
                  {listing.title}
                </h3>

                {/* Quick Stats */}
                <div className="flex flex-wrap gap-3 text-xs">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Icon type="bed" className="h-3 w-3" />
                    <span>{listing.bedrooms} bed</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Icon type="bath" className="h-3 w-3" />
                    <span>{listing.bathrooms} bath</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Icon type="home" className="h-3 w-3" />
                    <span>{listing.squareFeet.toLocaleString()} sqft</span>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-center gap-1 pt-2 border-t">
                  <Icon type="dollar" className="h-4 w-4 text-green-600" />
                  <span className="font-bold text-sm text-green-600">
                    GH₵{parseFloat(listing.price).toLocaleString()}
                  </span>
                </div>

                {/* Location */}
                <p className="text-xs text-muted-foreground">
                  {listing.city}, {listing.state}
                </p>
              </div>
            </div>
          </div>

          {/* Share Options */}
          <DropdownMenuLabel className="text-xs uppercase tracking-wider">
            Share via
          </DropdownMenuLabel>

          {shareOptions.map((option) => (
            <DropdownMenuItem
              key={option.name}
              onClick={option.action}
              className="gap-2 cursor-pointer"
            >
              <Icon type={option.icon} className="h-4 w-4" />
              <span>{option.name}</span>
              {copied && option.name === "Copy Link" && (
                <Icon type="check" className="h-4 w-4 ml-auto text-green-600" />
              )}
            </DropdownMenuItem>
          ))}

          <DropdownMenuSeparator />

          {/* Share URL */}
          <div className="p-3 space-y-2">
            <p className="text-xs text-muted-foreground font-medium">
              Share URL:
            </p>
            <div className="flex items-center gap-1 bg-muted rounded px-2 py-1.5 border text-xs">
              <Icon
                type="globe"
                className="h-3 w-3 text-muted-foreground flex-shrink-0"
              />
              <p className="text-muted-foreground truncate flex-1 font-mono">
                {listingUrl}
              </p>
              <button
                onClick={handleCopyLink}
                className="p-1 hover:bg-accent rounded transition-colors flex-shrink-0"
              >
                <Icon type="copy" className="h-3 w-3 text-muted-foreground" />
              </button>
            </div>
          </div>

          <div className="p-3 border-t">
            <p className="text-xs text-muted-foreground text-center">
              Share this listing to help others discover great properties
            </p>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
