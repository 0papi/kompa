"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Plus, X } from "lucide-react";
import {
  listingFormSchema,
  type ListingFormData,
} from "./schemas/listing-form.schema";
import { toast } from "sonner";
import { Textarea } from "../ui/textarea";
import { PROPERTY_TYPES, PROPERTY_CATEGORIES } from "@/lib/consts";

interface ListingFormProps {
  onSubmit: (data: ListingFormData) => void | Promise<void>;
  onCancel?: () => void;
  defaultValues?: Partial<ListingFormData>;
  isLoading?: boolean;
}

export function ListingForm({
  onSubmit,
  onCancel,
  defaultValues,
  isLoading = false,
}: ListingFormProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<ListingFormData>({
    resolver: zodResolver(listingFormSchema),
    defaultValues: {
      ...defaultValues,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "features",
  });

  const selectedCategory = watch("propertyCategory");

  const onFormSubmit = async (data: ListingFormData) => {
    try {
      await onSubmit(data);
      toast.success("Listing saved successfully");
    } catch (error) {
      toast.error("Failed to save listing");
      console.error("Form submission error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
      {/* Property Details Section */}
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-6">Property Details</h2>
        <div className="space-y-6">
          <div className="flex items-start gap-6">
            <Label htmlFor="title" className="w-1/3 pt-2 text-start shrink-0">
              <div>
                <div>
                  Title <span className="text-destructive">*</span>
                </div>
                <div className="text-xs text-muted-foreground font-normal mt-0.5">
                  A short, catchy name for the property
                </div>
              </div>
            </Label>
            <div className="flex-1 max-w-xl">
              <Input
                id="title"
                {...register("title")}
                placeholder="Beautiful 3-bedroom home in downtown"
                disabled={isLoading}
              />
              {errors.title && (
                <p className="text-sm text-destructive mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-start gap-6">
            <Label
              htmlFor="description"
              className="w-1/3 pt-2 text-start shrink-0"
            >
              <div>
                <div>
                  Status <span className="text-destructive">*</span>
                </div>
                <div className="text-xs text-muted-foreground font-normal mt-0.5">
                  Publish property to marketplace or save as draft
                </div>
              </div>
            </Label>
            <div className="flex-1 max-w-xl">
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="w-full" id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DRAFT">Draft</SelectItem>
                      <SelectItem value="PUBLISHED">Published</SelectItem>
                      <SelectItem value="ARCHIVED">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.status && (
                <p className="text-sm text-destructive mt-1">
                  {errors.status.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-start gap-6">
            <Label
              htmlFor="description"
              className="w-1/3 pt-2 text-start shrink-0"
            >
              <div>
                <div>
                  Description <span className="text-destructive">*</span>
                </div>
                <div className="text-xs text-muted-foreground font-normal mt-0.5">
                  Detailed information about features
                </div>
              </div>
            </Label>
            <div className="flex-1 max-w-xl">
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Provide a detailed description of the property..."
                className="flex min-h-[120px] w-full"
                disabled={isLoading}
              />
              {errors.description && (
                <p className="text-sm text-destructive mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-start gap-6">
            <Label
              htmlFor="propertyCategory"
              className="w-1/3 pt-2 text-start shrink-0"
            >
              <div>
                <div>
                  Property Category <span className="text-destructive">*</span>
                </div>
                <div className="text-xs text-muted-foreground font-normal mt-0.5">
                  Main category (e.g., Residential)
                </div>
              </div>
            </Label>
            <div className="flex-1 max-w-xl">
              <Controller
                name="propertyCategory"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="w-full" id="propertyCategory">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROPERTY_CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.propertyCategory && (
                <p className="text-sm text-destructive mt-1">
                  {errors.propertyCategory.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-start gap-6">
            <Label
              htmlFor="propertyType"
              className="w-1/3 pt-2 text-start shrink-0"
            >
              <div>
                <div>
                  Property Type <span className="text-destructive">*</span>
                </div>
                <div className="text-xs text-muted-foreground font-normal mt-0.5">
                  Specific type within category
                </div>
              </div>
            </Label>
            <div className="flex-1 max-w-xl">
              <Controller
                name="propertyType"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isLoading || !selectedCategory}
                  >
                    <SelectTrigger className="w-full" id="propertyType">
                      <SelectValue
                        placeholder={
                          selectedCategory
                            ? `Select type for ${selectedCategory}`
                            : "Select category first"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedCategory &&
                        PROPERTY_TYPES.get(selectedCategory)?.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.propertyType && (
                <p className="text-sm text-destructive mt-1">
                  {errors.propertyType.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <Separator className="my-2" />

      {/* Location Section */}
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-6">Property Location</h2>
        <div className="space-y-6">
          <div className="flex items-start gap-6">
            <Label htmlFor="street" className="w-1/3 pt-2 text-start shrink-0">
              <div>
                <div>
                  Street Address <span className="text-destructive">*</span>
                </div>
                <div className="text-xs text-muted-foreground font-normal mt-0.5">
                  Street number and name
                </div>
              </div>
            </Label>
            <div className="flex-1 max-w-xl">
              <Input
                id="street"
                {...register("street")}
                placeholder="123 Main Street"
                disabled={isLoading}
              />
              {errors.street && (
                <p className="text-sm text-destructive mt-1">
                  {errors.street.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-start gap-6">
            <Label htmlFor="city" className="w-1/3 pt-2 text-start shrink-0">
              <div>
                <div>
                  City <span className="text-destructive">*</span>
                </div>
                <div className="text-xs text-muted-foreground font-normal mt-0.5">
                  City where property is located
                </div>
              </div>
            </Label>
            <div className="flex-1 max-w-xl">
              <Input
                id="city"
                {...register("city")}
                placeholder="New York"
                disabled={isLoading}
              />
              {errors.city && (
                <p className="text-sm text-destructive mt-1">
                  {errors.city.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-start gap-6">
            <Label htmlFor="state" className="w-1/3 pt-2 text-start shrink-0">
              <div>
                <div>
                  State <span className="text-destructive">*</span>
                </div>
                <div className="text-xs text-muted-foreground font-normal mt-0.5">
                  State or province abbreviation
                </div>
              </div>
            </Label>
            <div className="flex-1 max-w-xl">
              <Input
                id="state"
                {...register("state")}
                placeholder="NY"
                disabled={isLoading}
              />
              {errors.state && (
                <p className="text-sm text-destructive mt-1">
                  {errors.state.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-start gap-6">
            <Label htmlFor="zipCode" className="w-1/3 pt-2 text-start shrink-0">
              <div>
                <div>
                  ZIP Code <span className="text-destructive">*</span>
                </div>
                <div className="text-xs text-muted-foreground font-normal mt-0.5">
                  Postal code for the location
                </div>
              </div>
            </Label>
            <div className="flex-1 max-w-xl">
              <Input
                id="zipCode"
                {...register("zipCode")}
                placeholder="10001"
                disabled={isLoading}
              />
              {errors.zipCode && (
                <p className="text-sm text-destructive mt-1">
                  {errors.zipCode.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-start gap-6">
            <Label htmlFor="county" className="w-1/3 pt-2 text-start shrink-0">
              <div>
                <div>County</div>
                <div className="text-xs text-muted-foreground font-normal mt-0.5">
                  County or district name
                </div>
              </div>
            </Label>
            <div className="flex-1 max-w-xl">
              <Input
                id="county"
                {...register("county")}
                placeholder="New York County"
                disabled={isLoading}
              />
              {errors.county && (
                <p className="text-sm text-destructive mt-1">
                  {errors.county.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <Separator className="my-2" />

      {/* Property Specifications */}
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-6">Property Specifications</h2>
        <div className="space-y-6">
          <div className="flex items-start gap-6">
            <Label htmlFor="price" className="w-1/3 pt-2 text-start shrink-0">
              <div>
                <div>
                  Price ($) <span className="text-destructive">*</span>
                </div>
                <div className="text-xs text-muted-foreground font-normal mt-0.5">
                  Listing price in dollars
                </div>
              </div>
            </Label>
            <div className="flex-1 max-w-xl">
              <Input
                id="price"
                type="number"
                {...register("price")}
                placeholder="500000"
                disabled={isLoading}
              />
              {errors.price && (
                <p className="text-sm text-destructive mt-1">
                  {errors.price.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-start gap-6">
            <Label
              htmlFor="pricePerSquareFoot"
              className="w-1/3 pt-2 text-start shrink-0"
            >
              <div>
                <div>Price per Sq Ft ($)</div>
                <div className="text-xs text-muted-foreground font-normal mt-0.5">
                  Cost per square foot
                </div>
              </div>
            </Label>
            <div className="flex-1 max-w-xl">
              <Input
                id="pricePerSquareFoot"
                type="number"
                step="0.01"
                {...register("pricePerSquareFoot")}
                placeholder="250.00"
                disabled={isLoading}
              />
              {errors.pricePerSquareFoot && (
                <p className="text-sm text-destructive mt-1">
                  {errors.pricePerSquareFoot.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-start gap-6">
            <Label
              htmlFor="bedrooms"
              className="w-1/3 pt-2 text-start shrink-0"
            >
              <div>
                <div>
                  Bedrooms <span className="text-destructive">*</span>
                </div>
                <div className="text-xs text-muted-foreground font-normal mt-0.5">
                  Total number of bedrooms
                </div>
              </div>
            </Label>
            <div className="flex-1 max-w-xl">
              <Input
                id="bedrooms"
                type="number"
                {...register("bedrooms")}
                placeholder="3"
                disabled={isLoading}
              />
              {errors.bedrooms && (
                <p className="text-sm text-destructive mt-1">
                  {errors.bedrooms.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-start gap-6">
            <Label
              htmlFor="bathrooms"
              className="w-1/3 pt-2 text-start shrink-0"
            >
              <div>
                <div>
                  Bathrooms <span className="text-destructive">*</span>
                </div>
                <div className="text-xs text-muted-foreground font-normal mt-0.5">
                  Total bathrooms (0.5 = half bath)
                </div>
              </div>
            </Label>
            <div className="flex-1 max-w-xl">
              <Input
                id="bathrooms"
                type="number"
                step="0.5"
                {...register("bathrooms")}
                placeholder="2"
                disabled={isLoading}
              />
              {errors.bathrooms && (
                <p className="text-sm text-destructive mt-1">
                  {errors.bathrooms.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-start gap-6">
            <Label
              htmlFor="squareFeet"
              className="w-1/3 pt-2 text-start shrink-0"
            >
              <div>
                <div>
                  Square Feet <span className="text-destructive">*</span>
                </div>
                <div className="text-xs text-muted-foreground font-normal mt-0.5">
                  Total interior living space
                </div>
              </div>
            </Label>
            <div className="flex-1 max-w-xl">
              <Input
                id="squareFeet"
                type="number"
                {...register("squareFeet")}
                placeholder="2000"
                disabled={isLoading}
              />
              {errors.squareFeet && (
                <p className="text-sm text-destructive mt-1">
                  {errors.squareFeet.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-start gap-6">
            <Label htmlFor="lotSize" className="w-1/3 pt-2 text-start shrink-0">
              <div>
                <div>Lot Size (acres)</div>
                <div className="text-xs text-muted-foreground font-normal mt-0.5">
                  Total land area in acres
                </div>
              </div>
            </Label>
            <div className="flex-1 max-w-xl">
              <Input
                id="lotSize"
                type="number"
                step="0.01"
                {...register("lotSize")}
                placeholder="0.25"
                disabled={isLoading}
              />
              {errors.lotSize && (
                <p className="text-sm text-destructive mt-1">
                  {errors.lotSize.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-start gap-6">
            <Label
              htmlFor="yearBuilt"
              className="w-1/3 pt-2 text-start shrink-0"
            >
              <div>
                <div>Year Built</div>
                <div className="text-xs text-muted-foreground font-normal mt-0.5">
                  Year construction was completed
                </div>
              </div>
            </Label>
            <div className="flex-1 max-w-xl">
              <Input
                id="yearBuilt"
                type="number"
                {...register("yearBuilt")}
                placeholder="2020"
                disabled={isLoading}
              />
              {errors.yearBuilt && (
                <p className="text-sm text-destructive mt-1">
                  {errors.yearBuilt.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-start gap-6">
            <Label htmlFor="stories" className="w-1/3 pt-2 text-start shrink-0">
              <div>
                <div>Stories</div>
                <div className="text-xs text-muted-foreground font-normal mt-0.5">
                  Number of floors or levels
                </div>
              </div>
            </Label>
            <div className="flex-1 max-w-xl">
              <Input
                id="stories"
                type="number"
                {...register("stories")}
                placeholder="2"
                disabled={isLoading}
              />
              {errors.stories && (
                <p className="text-sm text-destructive mt-1">
                  {errors.stories.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-start gap-6">
            <Label
              htmlFor="garageSpaces"
              className="w-1/3 pt-2 text-start shrink-0"
            >
              <div>
                <div>Garage Spaces</div>
                <div className="text-xs text-muted-foreground font-normal mt-0.5">
                  Number of cars that fit in garage
                </div>
              </div>
            </Label>
            <div className="flex-1 max-w-xl">
              <Input
                id="garageSpaces"
                type="number"
                {...register("garageSpaces")}
                placeholder="2"
                disabled={isLoading}
              />
              {errors.garageSpaces && (
                <p className="text-sm text-destructive mt-1">
                  {errors.garageSpaces.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-start gap-6">
            <Label
              htmlFor="parkingSpaces"
              className="w-1/3 pt-2 text-start shrink-0"
            >
              <div>
                <div>Parking Spaces</div>
                <div className="text-xs text-muted-foreground font-normal mt-0.5">
                  Total parking spots available
                </div>
              </div>
            </Label>
            <div className="flex-1 max-w-xl">
              <Input
                id="parkingSpaces"
                type="number"
                {...register("parkingSpaces")}
                placeholder="3"
                disabled={isLoading}
              />
              {errors.parkingSpaces && (
                <p className="text-sm text-destructive mt-1">
                  {errors.parkingSpaces.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-start gap-6">
            <Label
              htmlFor="condition"
              className="w-1/3 pt-2 text-start shrink-0"
            >
              <div>
                <div>
                  Condition <span className="text-destructive">*</span>
                </div>
                <div className="text-xs text-muted-foreground font-normal mt-0.5">
                  Overall state and quality
                </div>
              </div>
            </Label>
            <div className="flex-1 max-w-xl">
              <Controller
                name="condition"
                control={control}
                render={({ field }) => (
                  <Textarea
                    className="w-full min-h-[120px]"
                    placeholder="Describe the condition of the property"
                    {...field}
                  />
                )}
              />
              {errors.condition && (
                <p className="text-sm text-destructive mt-1">
                  {errors.condition.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <Separator className="my-2" />

      {/* Financial Details */}
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-6">Financial Details</h2>
        <div className="space-y-6">
          <div className="flex items-start gap-6">
            <Label htmlFor="hoaFees" className="w-1/3 pt-2 text-start shrink-0">
              <div>
                <div>HOA Fees (monthly)</div>
                <div className="text-xs text-muted-foreground font-normal mt-0.5">
                  Monthly homeowner association dues
                </div>
              </div>
            </Label>
            <div className="flex-1 max-w-xl">
              <Input
                id="hoaFees"
                type="number"
                {...register("hoaFees")}
                placeholder="250"
                disabled={isLoading}
              />
              {errors.hoaFees && (
                <p className="text-sm text-destructive mt-1">
                  {errors.hoaFees.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-start gap-6">
            <Label
              htmlFor="propertyTaxes"
              className="w-1/3 pt-2 text-start shrink-0"
            >
              <div>
                <div>Property Taxes (annual)</div>
                <div className="text-xs text-muted-foreground font-normal mt-0.5">
                  Annual tax paid to government
                </div>
              </div>
            </Label>
            <div className="flex-1 max-w-xl">
              <Input
                id="propertyTaxes"
                type="number"
                {...register("propertyTaxes")}
                placeholder="8000"
                disabled={isLoading}
              />
              {errors.propertyTaxes && (
                <p className="text-sm text-destructive mt-1">
                  {errors.propertyTaxes.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-start gap-6">
            <Label
              htmlFor="annualInsurance"
              className="w-1/3 pt-2 text-start shrink-0"
            >
              <div>
                <div>Annual Insurance</div>
                <div className="text-xs text-muted-foreground font-normal mt-0.5">
                  Yearly homeowner's insurance cost
                </div>
              </div>
            </Label>
            <div className="flex-1 max-w-xl">
              <Input
                id="annualInsurance"
                type="number"
                {...register("annualInsurance")}
                placeholder="1500"
                disabled={isLoading}
              />
              {errors.annualInsurance && (
                <p className="text-sm text-destructive mt-1">
                  {errors.annualInsurance.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <Separator className="my-2" />

      {/* Valuation & Sale Details */}
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-6">Valuation & Sale Details</h2>
        <div className="space-y-6">
          <div className="flex items-start gap-6">
            <Label
              htmlFor="valuationMethod"
              className="w-1/3 pt-2 text-start shrink-0"
            >
              <div>
                <div>
                  Valuation Method <span className="text-destructive">*</span>
                </div>
                <div className="text-xs text-muted-foreground font-normal mt-0.5">
                  Approach used to determine value
                </div>
              </div>
            </Label>
            <div className="flex-1 max-w-xl">
              <Controller
                name="valuationMethod"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="w-full" id="valuationMethod">
                      <SelectValue placeholder="Select valuation method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SALES_COMPARISON">
                        Sales Comparison Approach
                      </SelectItem>
                      <SelectItem value="COST_APPROACH">
                        Cost Approach
                      </SelectItem>
                      <SelectItem value="INCOME_APPROACH">
                        Income Approach
                      </SelectItem>
                      <SelectItem value="MIXED">Mixed Approach</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.valuationMethod && (
                <p className="text-sm text-destructive mt-1">
                  {errors.valuationMethod.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-start gap-6">
            <Label
              htmlFor="listDate"
              className="w-1/3 pt-2 text-start shrink-0"
            >
              <div>
                <div>List Date</div>
                <div className="text-xs text-muted-foreground font-normal mt-0.5">
                  When property was listed for sale
                </div>
              </div>
            </Label>
            <div className="flex-1 max-w-xl">
              <Input
                id="listDate"
                type="date"
                {...register("listDate")}
                disabled={isLoading}
              />
              {errors.listDate && (
                <p className="text-sm text-destructive mt-1">
                  {errors.listDate.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-start gap-6">
            <Label
              htmlFor="saleDate"
              className="w-1/3 pt-2 text-start shrink-0"
            >
              <div>
                <div>Sale Date</div>
                <div className="text-xs text-muted-foreground font-normal mt-0.5">
                  When property was sold
                </div>
              </div>
            </Label>
            <div className="flex-1 max-w-xl">
              <Input
                id="saleDate"
                type="date"
                {...register("saleDate")}
                disabled={isLoading}
              />
              {errors.saleDate && (
                <p className="text-sm text-destructive mt-1">
                  {errors.saleDate.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-start gap-6">
            <Label
              htmlFor="daysOnMarket"
              className="w-1/3 pt-2 text-start shrink-0"
            >
              <div>
                <div>Days on Market</div>
                <div className="text-xs text-muted-foreground font-normal mt-0.5">
                  How long property was listed
                </div>
              </div>
            </Label>
            <div className="flex-1 max-w-xl">
              <Input
                id="daysOnMarket"
                type="number"
                {...register("daysOnMarket")}
                placeholder="30"
                disabled={isLoading}
              />
              {errors.daysOnMarket && (
                <p className="text-sm text-destructive mt-1">
                  {errors.daysOnMarket.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <Separator className="my-2" />

      {/* Additional Features */}
      <div className="p-6">
        <div className="space-y-4">
          <div className="flex items-start gap-6">
            <Label className="w-1/3 pt-2 text-start shrink-0">
              <div>
                <div>Additional Features</div>
                <div className="text-xs text-muted-foreground font-normal mt-0.5">
                  Special property features
                </div>
              </div>
            </Label>
            <div className="flex-1 max-w-xl space-y-3">
              <div className="flex flex-wrap gap-2">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="flex items-center gap-1.5 rounded-md px-3 py-1.5"
                  >
                    <Input
                      {...register(`features.${index}.name` as const)}
                      placeholder="Feature name"
                      disabled={isLoading}
                      className="h-6 border-0 px-2 bg-transparent text-sm w-32 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                      disabled={isLoading}
                      className="h-5 w-5 hover:bg-transparent"
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ name: "" })}
                  disabled={isLoading}
                  className="h-8 px-3 gap-1.5"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Feature
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator className="my-2" />

      {/* Comparable Notes */}
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-6">Additional Notes</h2>
        <div className="flex items-start gap-6">
          <Label
            htmlFor="comparableNotes"
            className="w-1/3 pt-2 text-start shrink-0"
          >
            <div>
              <div>Comparable Notes</div>
              <div className="text-xs text-muted-foreground font-normal mt-0.5">
                Additional information
              </div>
            </div>
          </Label>
          <div className="flex-1 max-w-xl">
            <Textarea
              id="comparableNotes"
              {...register("comparableNotes")}
              placeholder="Add any additional notes about this comparable property..."
              className="flex min-h-[120px] w-full "
              disabled={isLoading}
            />
            {errors.comparableNotes && (
              <p className="text-sm text-destructive mt-1">
                {errors.comparableNotes.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <Separator className="my-2" />

      {/* Form Actions */}
      <div className="flex flex-row-reverse">
        <div className="flex items-center gap-4">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Listing"}
          </Button>
        </div>
      </div>
    </form>
  );
}
