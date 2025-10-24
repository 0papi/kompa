"use client";

import { useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { X } from "lucide-react";

export function MarketplaceSidebarFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get current filter values from URL
  const filters = {
    search: searchParams.get("search") || "",
    city: searchParams.get("city") || "",
    state: searchParams.get("state") || "",
    propertyCategory: searchParams.get("propertyCategory") || "",
    propertyType: searchParams.get("propertyType") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    minBedrooms: searchParams.get("minBedrooms") || "",
    minBathrooms: searchParams.get("minBathrooms") || "",
  };

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    return Object.values(filters).filter((value) => value !== "").length;
  }, [
    filters.search,
    filters.city,
    filters.state,
    filters.propertyCategory,
    filters.propertyType,
    filters.minPrice,
    filters.maxPrice,
    filters.minBedrooms,
    filters.minBathrooms,
  ]);

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value && value !== " ") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push("/marketplace");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filters</h2>
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-8 text-xs"
          >
            <X className="h-3 w-3 mr-1" />
            Clear all
          </Button>
        )}
      </div>

      <Separator />

      {/* Search */}
      <div className="space-y-2">
        <Label htmlFor="search" className="text-sm font-medium">
          Search
        </Label>
        <Input
          id="search"
          placeholder="Search listings..."
          value={filters.search}
          onChange={(e) => updateFilter("search", e.target.value)}
          className="h-9"
        />
      </div>

      <Separator />

      {/* Location */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold">Location</h3>

        <div className="space-y-2">
          <Label htmlFor="city" className="text-xs text-muted-foreground">
            City
          </Label>
          <Input
            id="city"
            placeholder="Any city"
            value={filters.city}
            onChange={(e) => updateFilter("city", e.target.value)}
            className="h-9"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="state" className="text-xs text-muted-foreground">
            State
          </Label>
          <Input
            id="state"
            placeholder="Any state"
            value={filters.state}
            onChange={(e) => updateFilter("state", e.target.value)}
            className="h-9"
          />
        </div>
      </div>

      <Separator />

      {/* Property Type */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold">Property Type</h3>

        <div className="space-y-2">
          <Label
            htmlFor="propertyCategory"
            className="text-xs text-muted-foreground"
          >
            Category
          </Label>
          <Select
            value={filters.propertyCategory}
            onValueChange={(value) => updateFilter("propertyCategory", value)}
          >
            <SelectTrigger id="propertyCategory" className="h-9 w-full">
              <SelectValue placeholder="Any category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">Any category</SelectItem>
              <SelectItem value="RESIDENTIAL">Residential</SelectItem>
              <SelectItem value="COMMERCIAL">Commercial</SelectItem>
              <SelectItem value="LAND">Land</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="propertyType"
            className="text-xs text-muted-foreground"
          >
            Type
          </Label>
          <Select
            value={filters.propertyType}
            onValueChange={(value) => updateFilter("propertyType", value)}
          >
            <SelectTrigger id="propertyType" className="h-9 w-full">
              <SelectValue placeholder="Any type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">Any type</SelectItem>
              <SelectItem value="SINGLE_FAMILY">Single Family</SelectItem>
              <SelectItem value="MULTI_FAMILY">Multi Family</SelectItem>
              <SelectItem value="CONDO">Condo</SelectItem>
              <SelectItem value="TOWNHOUSE">Townhouse</SelectItem>
              <SelectItem value="APARTMENT">Apartment</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator />

      {/* Price Range */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold">Price Range</h3>

        <div className="space-y-2">
          <Label htmlFor="minPrice" className="text-xs text-muted-foreground">
            Minimum
          </Label>
          <Input
            id="minPrice"
            type="number"
            placeholder="No min"
            value={filters.minPrice}
            onChange={(e) => updateFilter("minPrice", e.target.value)}
            className="h-9"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="maxPrice" className="text-xs text-muted-foreground">
            Maximum
          </Label>
          <Input
            id="maxPrice"
            type="number"
            placeholder="No max"
            value={filters.maxPrice}
            onChange={(e) => updateFilter("maxPrice", e.target.value)}
            className="h-9"
          />
        </div>
      </div>

      <Separator />

      {/* Rooms */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold">Rooms</h3>

        <div className="space-y-2">
          <Label
            htmlFor="minBedrooms"
            className="text-xs text-muted-foreground"
          >
            Bedrooms
          </Label>
          <Select
            value={filters.minBedrooms}
            onValueChange={(value) => updateFilter("minBedrooms", value)}
          >
            <SelectTrigger id="minBedrooms" className="h-9 w-full">
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">Any</SelectItem>
              <SelectItem value="1">1+</SelectItem>
              <SelectItem value="2">2+</SelectItem>
              <SelectItem value="3">3+</SelectItem>
              <SelectItem value="4">4+</SelectItem>
              <SelectItem value="5">5+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="minBathrooms"
            className="text-xs text-muted-foreground"
          >
            Bathrooms
          </Label>
          <Select
            value={filters.minBathrooms}
            onValueChange={(value) => updateFilter("minBathrooms", value)}
          >
            <SelectTrigger id="minBathrooms" className="h-9 w-full">
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">Any</SelectItem>
              <SelectItem value="1">1+</SelectItem>
              <SelectItem value="2">2+</SelectItem>
              <SelectItem value="3">3+</SelectItem>
              <SelectItem value="4">4+</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
