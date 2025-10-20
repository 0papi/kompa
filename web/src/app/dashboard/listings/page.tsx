"use client";

import { ListingsHeader, ListingsTable } from "@/components/listings";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  return (
    <div className="flex-1 space-y-6">
      <ListingsHeader
        onCreateNew={() => router.push("/dashboard/listings/new")}
      />

      <ListingsTable />
    </div>
  );
}
