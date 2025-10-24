"use client";

import { X, Plus } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PROPERTY_CATEGORIES, PROPERTY_TYPES } from "@/lib/consts";
import { Separator } from "../ui/separator";
import { LayoutToggle } from "./layout-toggle";

interface FilterValue {
  type: string;
  label: string;
  displayValue: string;
}

const FILTER_CONFIG = {
  status: {
    label: "Status",
    type: "multi-select",
    values: ["DRAFT", "PUBLISHED", "ARCHIVED"],
  },
  propertyCategory: {
    label: "Property Category",
    type: "multi-select",
    values: PROPERTY_CATEGORIES,
  },
  propertyType: {
    label: "Property Type",
    type: "multi-select",
    isDynamic: true,
  },
  bedrooms: {
    label: "Bedrooms",
    type: "multi-select",
    values: ["1", "2", "3", "4", "5+"],
  },
  bathrooms: {
    label: "Bathrooms",
    type: "multi-select",
    values: ["1", "1.5", "2", "2.5", "3+"],
  },
  minPrice: {
    label: "Price",
    type: "range",
  },
  yearBuilt: {
    label: "Year Built",
    type: "range",
  },
};

export default function ListingFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeFilters: FilterValue[] = [];

  // Parse active filters from URL params
  Object.keys(FILTER_CONFIG).forEach((key) => {
    const value = searchParams.get(key);
    if (value) {
      const config = FILTER_CONFIG[key as keyof typeof FILTER_CONFIG];
      activeFilters.push({
        type: key,
        label: config.label,
        displayValue: value,
      });
    }
  });

  // Get minPrice and maxPrice if they exist
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  if (minPrice || maxPrice) {
    const existing = activeFilters.find((f) => f.type === "minPrice");
    if (!existing) {
      activeFilters.push({
        type: "minPrice",
        label: "Price",
        displayValue: `$${minPrice || "0"} - $${maxPrice || "∞"}`,
      });
    }
  }

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const removeFilter = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (key === "minPrice") {
      params.delete("minPrice");
      params.delete("maxPrice");
    } else {
      params.delete(key);
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const clearAllFilters = () => {
    router.push(window.location.pathname, { scroll: false });
  };

  const toggleMultiSelectValue = (
    filterKey: string,
    value: string,
    isChecked: boolean,
  ) => {
    const current = searchParams.get(filterKey) || "";
    const values = current ? current.split(",") : [];

    const updated = isChecked
      ? [...values, value]
      : values.filter((v) => v !== value);

    updateFilter(filterKey, updated.join(","));
  };

  // Get dynamic property types based on selected category
  const selectedCategory = searchParams.get("propertyCategory");
  const propertyTypeValues = selectedCategory
    ? PROPERTY_TYPES.get(selectedCategory) || []
    : [];

  return (
    <div className="space-y-4">
      {/* Filter Buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Status Filter */}
        <FilterPopover
          label="Status"
          filterKey="status"
          type="multi-select"
          values={FILTER_CONFIG.status.values}
          currentValue={searchParams.get("status") || ""}
          onToggle={(value, isChecked) =>
            toggleMultiSelectValue("status", value, isChecked)
          }
        />

        {/* Property Category Filter */}
        <FilterPopover
          label="Property Category"
          filterKey="propertyCategory"
          type="multi-select"
          values={FILTER_CONFIG.propertyCategory.values}
          currentValue={searchParams.get("propertyCategory") || ""}
          onToggle={(value, isChecked) =>
            toggleMultiSelectValue("propertyCategory", value, isChecked)
          }
        />

        {/* Property Type Filter - Only show if category selected */}
        {selectedCategory && (
          <FilterPopover
            label="Property Type"
            filterKey="propertyType"
            type="multi-select"
            values={propertyTypeValues}
            currentValue={searchParams.get("propertyType") || ""}
            onToggle={(value, isChecked) =>
              toggleMultiSelectValue("propertyType", value, isChecked)
            }
          />
        )}

        {/* Bedrooms Filter */}
        <FilterPopover
          label="Bedrooms"
          filterKey="bedrooms"
          type="multi-select"
          values={FILTER_CONFIG.bedrooms.values}
          currentValue={searchParams.get("bedrooms") || ""}
          onToggle={(value, isChecked) =>
            toggleMultiSelectValue("bedrooms", value, isChecked)
          }
        />

        {/* Bathrooms Filter */}
        <FilterPopover
          label="Bathrooms"
          filterKey="bathrooms"
          type="multi-select"
          values={FILTER_CONFIG.bathrooms.values}
          currentValue={searchParams.get("bathrooms") || ""}
          onToggle={(value, isChecked) =>
            toggleMultiSelectValue("bathrooms", value, isChecked)
          }
        />

        {/* Price Range Filter */}
        <RangeFilterPopover
          label="Price"
          minKey="minPrice"
          maxKey="maxPrice"
          minValue={searchParams.get("minPrice") || ""}
          maxValue={searchParams.get("maxPrice") || ""}
          onUpdate={(min, max) => {
            const params = new URLSearchParams(searchParams.toString());
            if (min) params.set("minPrice", min);
            else params.delete("minPrice");
            if (max) params.set("maxPrice", max);
            else params.delete("maxPrice");
            router.push(`?${params.toString()}`, { scroll: false });
          }}
        />

        {/* Year Built Filter */}
        <RangeFilterPopover
          label="Year Built"
          minKey="minYearBuilt"
          maxKey="maxYearBuilt"
          minValue={searchParams.get("minYearBuilt") || ""}
          maxValue={searchParams.get("maxYearBuilt") || ""}
          onUpdate={(min, max) => {
            const params = new URLSearchParams(searchParams.toString());
            if (min) params.set("minYearBuilt", min);
            else params.delete("minYearBuilt");
            if (max) params.set("maxYearBuilt", max);
            else params.delete("maxYearBuilt");
            router.push(`?${params.toString()}`, { scroll: false });
          }}
        />

        {/* Spacer */}
        <div className="flex-1" />

        {/* Clear Filter Button */}
        {activeFilters.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="gap-1.5"
          >
            <X className="h-4 w-4" />
            Clear filter
          </Button>
        )}

        {/* Layout Toggle */}
        <LayoutToggle />
      </div>

      {/* Separator */}
      <Separator />

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          {activeFilters.map(({ type, label, displayValue }) => (
            <Badge
              key={type}
              variant="secondary"
              className="gap-2 px-3 py-1.5 text-sm"
            >
              <X className="h-3 w-3" />
              <span className="font-medium">{label}</span>
              <span className="text-slate-600">{displayValue}</span>
              <button
                onClick={() => removeFilter(type)}
                className="ml-1 hover:opacity-70"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {activeFilters.length > 0 && <Separator />}
    </div>
  );
}

interface FilterPopoverProps {
  label: string;
  filterKey: string;
  type: string;
  values: string[];
  currentValue: string;
  onToggle: (value: string, isChecked: boolean) => void;
}

function FilterPopover({
  label,
  filterKey,
  type,
  values,
  currentValue,
  onToggle,
}: FilterPopoverProps) {
  const selectedValues = currentValue ? currentValue.split(",") : [];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          <Plus className="h-4 w-4" />
          {label}
          {selectedValues.length > 0 && (
            <Badge
              variant="default"
              className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {selectedValues.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56" align="start">
        <div className="space-y-4">
          <h3 className="font-semibold text-sm">
            Filter by {label.toLowerCase()}
          </h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {values.map((value) => (
              <div key={value} className="flex items-center space-x-2">
                <Checkbox
                  id={`${filterKey}-${value}`}
                  checked={selectedValues.includes(value)}
                  onCheckedChange={(isChecked) =>
                    onToggle(value, isChecked as boolean)
                  }
                />
                <label
                  htmlFor={`${filterKey}-${value}`}
                  className="text-sm cursor-pointer flex-1"
                >
                  {value}
                </label>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

interface RangeFilterPopoverProps {
  label: string;
  minKey: string;
  maxKey: string;
  minValue: string;
  maxValue: string;
  onUpdate: (min: string, max: string) => void;
}

function RangeFilterPopover({
  label,
  minKey,
  maxKey,
  minValue,
  maxValue,
  onUpdate,
}: RangeFilterPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          <Plus className="h-4 w-4" />
          {label}
          {(minValue || maxValue) && (
            <Badge
              variant="default"
              className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              1
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56" align="start">
        <div className="space-y-4">
          <h3 className="font-semibold text-sm">
            Filter by {label.toLowerCase()}
          </h3>
          <div className="space-y-3">
            <div className="space-y-2">
              <label className="text-xs font-medium">Min {label}</label>
              <Input
                type="number"
                placeholder={`Min ${label}`}
                value={minValue}
                onChange={(e) => onUpdate(e.target.value, maxValue)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium">Max {label}</label>
              <Input
                type="number"
                placeholder={`Max ${label}`}
                value={maxValue}
                onChange={(e) => onUpdate(minValue, e.target.value)}
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
