import React, { useEffect, useState } from "react";
import { DollarSign, Check, X, Info } from "lucide-react";
import { useShowSetPriceModalStore } from "./hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ListingFormData } from "./schemas/listing-form.schema";
import { listingsApi } from "@/lib/api/listings";
import { toast } from "sonner";

export default function ComparablePriceModal() {
  const { isOpen, setIsOpen, listing } = useShowSetPriceModalStore();
  const [price, setPrice] = useState<string | undefined>(undefined);
  console.log("listing", listing);
  const [isAnimating, setIsAnimating] = useState(false);
  const queryClient = useQueryClient();

  const updateListingMutation = useMutation({
    mutationFn: (data: ListingFormData) =>
      listingsApi.update(listing?.id as string, data),
    onSuccess: (response) => {
      toast.success("Listing price has been set");

      queryClient.invalidateQueries({ queryKey: ["listing", listing?.id] });
      queryClient.invalidateQueries({ queryKey: ["listings"] });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.message || "Failed to set listing price. Please try again.";
      toast.error(errorMessage);
    },
  });

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(e.target.value);
  };

  useEffect(() => {
    if (listing?.comparablePrice) {
      setPrice(listing.comparablePrice);
    }
  }, [listing?.comparablePrice]);

  const handleSave = async () => {
    if (price && parseFloat(price) > 0) {
      // @ts-ignore
      await updateListingMutation.mutateAsync({
        comparablePrice: parseFloat(price),
      });
      setIsAnimating(true);
      setPrice(undefined);
      setIsAnimating(false);
      setIsOpen(false);
    }
  };

  const handleCancel = () => {
    setPrice(undefined);
    setIsOpen(false);
  };

  const platformFee = price ? parseFloat(price) * 0.05 : 0;
  const youReceive = price ? parseFloat(price) - platformFee : 0;

  return (
    <div className="min-h-screen bg-black dark:bg-black flex items-center justify-center p-4">
      {/* Modal Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={handleCancel}
        >
          {/* Modal */}
          <div
            className="bg-white dark:bg-background/90 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-2xl max-w-md w-full p-8 transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-black dark:bg-white rounded-lg">
                  <DollarSign className="w-6 h-6 text-white dark:text-black" />
                </div>
                <h2 className="text-2xl font-bold text-black dark:text-white">
                  Set Price
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-500 text-sm">
                Ghana Cedis (GHS)
              </p>
            </div>

            {/* Input Section */}
            <div className="mb-8">
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-semibold text-black dark:text-white">
                  ₵
                </div>
                <input
                  type="text"
                  value={price}
                  onChange={handlePriceChange}
                  placeholder="0.00"
                  autoFocus
                  className="w-full bg-gray-50 dark:bg-background border-2 border-gray-300 dark:border-gray-700 rounded-xl pl-12 pr-4 py-4 text-3xl font-bold text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                />
              </div>

              {/* Fee Breakdown */}
              {price && parseFloat(price) > 0 && (
                <div className="mt-4 space-y-3 p-4 bg-gray-50 dark:bg-background border border-gray-300 dark:border-gray-700 rounded-xl">
                  {/* Item 1: Listing Price */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Listing Price
                    </span>
                    <span className="text-sm font-semibold text-black dark:text-white">
                      ₵{parseFloat(price)?.toFixed(2)}
                    </span>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-gray-300 dark:bg-gray-700"></div>

                  {/* Item 2: Platform Fee */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Platform Fee (5%)
                      </span>
                      <div className="group relative">
                        <Info className="w-4 h-4 text-gray-400 dark:text-gray-600 cursor-help hover:text-gray-600 dark:hover:text-gray-400 transition-colors" />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-black dark:bg-white text-white dark:text-black text-xs p-2 rounded-lg whitespace-nowrap z-10">
                          Processing via Paystack
                        </div>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                      -₵{platformFee.toFixed(2)}
                    </span>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-gray-300 dark:bg-gray-700"></div>

                  {/* Item 3: You Receive */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-black dark:text-white">
                      You Receive
                    </span>
                    <span className="text-lg font-bold text-green-600 dark:text-green-400">
                      ₵{youReceive.toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              {/* Live Preview (when no price set) */}
              {!price && (
                <div className="mt-4 p-3 bg-gray-100 dark:bg-background border border-gray-300 dark:border-gray-700 rounded-xl">
                  <div className="text-xs text-gray-600 dark:text-gray-500 mb-1">
                    Enter a price to see breakdown
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-600">
                    Powered by Paystack
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-background dark:hover:bg-gray-900 text-black dark:text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-700"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={
                  !price ||
                  parseFloat(price.toString()) <= 0 ||
                  updateListingMutation.isPending
                }
                className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                  price && parseFloat(price.toString()) > 0
                    ? "bg-black dark:bg-white hover:bg-gray-900 dark:hover:bg-gray-100 text-white dark:text-black shadow-lg hover:shadow-xl disabled:opacity-50"
                    : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                } ${isAnimating ? "scale-95" : "scale-100"}`}
              >
                <Check className="w-4 h-4" />
                {updateListingMutation.isPending ? "Setting..." : "Save Price"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
