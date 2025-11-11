import { MarketplaceContent } from "@/components/marketplace/main-marketplace-content";
import { Loader2 } from "lucide-react";

import { Suspense } from "react";

export const metadata = {
  title: "Marketplace",
  description: "Explore and buy comparable property data from our marketplace",
};

export default function MarketplacePage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto px-4 py-6 max-w-7xl flex justify-center items-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <MarketplaceContent />
    </Suspense>
  );
}
