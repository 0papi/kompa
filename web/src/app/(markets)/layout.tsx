import { MarketplaceHeader } from "@/components/marketplace";

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <MarketplaceHeader />
      {children}
    </div>
  );
}
