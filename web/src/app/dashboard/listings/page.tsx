"use client";

import { ListingsHeader, ListingsTable } from "@/components/listings";
import ComparablePriceModal from "@/components/listings/ComparablePriceModal";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  return (
    <div className="flex-1 space-y-4">
      <ListingsHeader
        onCreateNew={() => router.push("/dashboard/listings/new")}
      />
      <Separator />
      <ListingsTable />
      <ComparablePriceModal />
    </div>
  );
}
