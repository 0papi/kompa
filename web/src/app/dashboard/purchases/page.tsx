import { ListingsHeader } from "@/components/listings";
import PurchasesTable from "@/components/purchases/purchases-table";
import { Separator } from "@/components/ui/separator";

export default function MyPurchases(){
  return (
    <div className="space-y-4">
       <div className="">
        <div className="">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">My Purchases</h1>
            <p className="mt-2 text-sm text-muted-foreground">Manage all your comparable purchases</p>
          </div>
        </div>
      </div>

      <Separator />

      <PurchasesTable />
    </div>
  )
}
