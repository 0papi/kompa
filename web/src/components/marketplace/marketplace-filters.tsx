"use client";

import { useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function MarketplaceFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  // Get current filter values from URL
  const filters = {
    search: searchParams.get("search") || "",
    city: searchParams.get("city") || "",
    state: searchParams.get("state") || "",
    propertyCategory: searchParams.get("propertyCategory") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    minBedrooms: searchParams.get("minBedrooms") || "",
  };

  // Count active filters (excluding search)
  const activeFiltersCount = useMemo(() => {
    return Object.entries(filters)
      .filter(([key, value]) => key !== "search" && value !== "")
      .length;
  }, [
    filters.city,
    filters.state,
    filters.propertyCategory,
    filters.minPrice,
    filters.maxPrice,
    filters.minBedrooms,
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
    <div className="mb-6 space-y-4">
      {/* Search and Filter Toggle */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search by title or description..."
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="relative"
        >
          <SlidersHorizontal className="h-5 w-5 mr-2" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge className="ml-2 px-1.5 min-w-5 h-5 flex items-center justify-center">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Expandable Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="rounded-lg border bg-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Filter Properties</h3>
                {activeFiltersCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-muted-foreground"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Clear All
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* City */}
                <div>
                  <label className="text-sm font-medium mb-2 block">City</label>
                  <Input
                    placeholder="Enter city"
                    value={filters.city}
                    onChange={(e) => updateFilter("city", e.target.value)}
                  />
                </div>

                {/* State */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    State
                  </label>
                  <Input
                    placeholder="Enter state"
                    value={filters.state}
                    onChange={(e) => updateFilter("state", e.target.value)}
                  />
                </div>

                {/* Property Category */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Property Category
                  </label>
                  <Select
                    value={filters.propertyCategory}
                    onValueChange={(value) =>
                      updateFilter("propertyCategory", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value=" ">All Categories</SelectItem>
                      <SelectItem value="RESIDENTIAL">Residential</SelectItem>
                      <SelectItem value="COMMERCIAL">Commercial</SelectItem>
                      <SelectItem value="LAND">Land</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Min Bedrooms */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Min Bedrooms
                  </label>
                  <Select
                    value={filters.minBedrooms}
                    onValueChange={(value) => updateFilter("minBedrooms", value)}
                  >
                    <SelectTrigger>
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

                {/* Min Price */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Min Price
                  </label>
                  <Input
                    type="number"
                    placeholder="Min price"
                    value={filters.minPrice}
                    onChange={(e) => updateFilter("minPrice", e.target.value)}
                  />
                </div>

                {/* Max Price */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Max Price
                  </label>
                  <Input
                    type="number"
                    placeholder="Max price"
                    value={filters.maxPrice}
                    onChange={(e) => updateFilter("maxPrice", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
