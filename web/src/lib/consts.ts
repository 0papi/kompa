import { BarChart3, Building, CreditCard, Landmark, Search, ShoppingCart, type LucideIcon } from "lucide-react"

export type AccountType = "PROVIDER" | "CONSUMER"

export type DashboardLink = {
  /** The visible text label for the navigation item. */
  label: string;
  /** The route/path for the link. */
  href: string;
  /** The icon component to be displayed next to the label. */
  icon: LucideIcon;
};


export const ROLE_SPECIFIC_DASHBOARD_ITEMS: Record<
  AccountType,
  DashboardLink[]
> = {
  CONSUMER: [
    {
      label: "Search Comparables",
      href: "/dashboard/search",
      icon: Search,
    },
    {
      label: "My Purchases",
      href: "/dashboard/purchases",
      icon: ShoppingCart,
    },
    {
      label: "Billing",
      href: "/dashboard/billing",
      icon: CreditCard,
    },
  ],

 
  PROVIDER: [
    {
      label: "My Listings",
      href: "/dashboard/listings",
      icon: Building,
    },
    {
      label: "Sales & Analytics",
      href: "/dashboard/analytics",
      icon: BarChart3,
    },
    {
      label: "Payouts",
      href: "/dashboard/payouts",
      icon: Landmark,
    },
  ],
};
