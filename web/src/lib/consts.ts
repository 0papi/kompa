import {
  BarChart3,
  Building,
  CreditCard,
  Landmark,
  Search,
  ShoppingCart,
  type LucideIcon,
} from "lucide-react";

export type AccountType = "PROVIDER" | "CONSUMER" | "CONSUMER_PROVIDER";

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
  ],

  PROVIDER: [
    {
      label: "My Comparables",
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

  CONSUMER_PROVIDER: [
    {
      label: "My Comparables",
      href: "/dashboard/listings",
      icon: Building,
    },
    {
      label: "My Purchases",
      href: "/dashboard/purchases",
      icon: ShoppingCart,
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

export const PROPERTY_TYPES = new Map([
  [
    "Residential",
    [
      "Apartment / Flat",
      "Detached House",
      "Semi-Detached House",
      "Townhouse",
      "Duplex",
      "Bungalow",
      "Villa",
      "Condominium",
      "Studio Apartment",
      "Shared Room / Co-living Space",
      "Mansion",
      "Penthouse",
      "Farmhouse",
      "Chalet / Cottage",
    ],
  ],
  [
    "Commercial",
    [
      "Office Space",
      "Retail Shop / Storefront",
      "Shopping Mall Unit",
      "Warehouse",
      "Industrial / Factory Building",
      "Cold Storage Facility",
      "Hotel / Guesthouse",
      "Restaurant / Bar",
      "Event Center / Hall",
      "Medical Facility / Clinic",
      "Educational Facility / School",
      "Mixed-use Building",
    ],
  ],
  [
    "Land",
    [
      "Residential Land",
      "Commercial Land",
      "Industrial Land",
      "Agricultural Land / Farmland",
      "Mixed-use Land",
      "Waterfront Land",
      "Bare Land / Plot",
    ],
  ],
  [
    "Development / Investment",
    [
      "Under-construction Property",
      "Completed Building",
      "Redevelopment Project",
      "Joint Venture Opportunity",
    ],
  ],
  [
    "Special Use / Institutional",
    [
      "Religious Building (Church, Mosque, Temple)",
      "Hospital / Healthcare Facility",
      "Government Building",
      "Community Center",
      "Recreational Facility (Sports Complex, Gym, etc.)",
    ],
  ],
]);

export const PROPERTY_CATEGORIES = Array.from(PROPERTY_TYPES.keys());
