import React from "react";

// --- (Mock) Badge Component ---
// Added a mock Badge component so the file is runnable.
// You can remove this and import your actual Badge component.
interface BadgeProps {
  className?: string;
  variant?: "outline" | "default" | "secondary" | "destructive";
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

const Badge: React.FC<BadgeProps> = ({
  className = "",
  variant = "default",
  children,
  onClick,
}) => (
  <div
    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}
    onClick={onClick}
  >
    {children}
  </div>
);

const CATEGORY_COLORS: { [key: string]: string } = {
  Residential: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  Commercial: "bg-green-100 text-green-800 hover:bg-green-200",
  Industrial: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  Land: "bg-purple-100 text-purple-800 hover:bg-purple-200",
};

const PROPERTY_TYPES = new Map<string, string[]>([
  ["Residential", ["Single-Family", "Apartment", "Condo", "Townhouse"]],
  ["Commercial", ["Office", "Retail", "Mixed-Use"]],
  ["Industrial", ["Warehouse", "Factory", "Flex Space"]],
  ["Land", ["Residential Lot", "Acreage"]],
]);

interface PropertyCategoryBadgeProps {
  /**
   * The category name to display.
   */
  category: string;
  /**
   * Optional click handler function.
   */
  onClick?: (category: string) => void;
}

export const PropertyCategoryBadge: React.FC<PropertyCategoryBadgeProps> = ({
  category,
  onClick,
}) => {
  const colorClass =
    CATEGORY_COLORS[category] || "bg-gray-100 text-gray-800 hover:bg-gray-200";

  const isClickable = !!onClick;
  const cursorClass = isClickable ? "cursor-pointer" : "cursor-default";

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    // Prevent default badge click behavior if any (e.g., if it's inside a link)
    event.stopPropagation();
    if (onClick) {
      onClick(category);
    }
  };

  return (
    <Badge
      className={`${colorClass} ${cursorClass} px-3 py-1 text-sm font-medium transition-colors`}
      variant="outline"
      onClick={isClickable ? handleClick : undefined}
    >
      {category}
    </Badge>
  );
};

interface PropertySubcategoryBadgeProps {
  /**
   * The property subcategory name.
   */
  subcategory: string;
  /**
   * The parent category (for color reference).
   */
  category: string;
  /**
   * Optional click handler.
   */
  onClick?: (subcategory: string) => void;
}

export const PropertySubcategoryBadge: React.FC<
  PropertySubcategoryBadgeProps
> = ({ subcategory, category, onClick }) => {
  const baseColorClass =
    CATEGORY_COLORS[category] || "bg-gray-100 text-gray-800 hover:bg-gray-200";
  // Make subcategory badges slightly more subtle with reduced opacity
  const subcategoryClass = baseColorClass
    .replace("100", "50")
    .replace("800", "700")
    .replace("200", "100"); // Also soften the hover

  // Determine if the badge should be clickable
  const isClickable = !!onClick;
  const cursorClass = isClickable ? "cursor-pointer" : "cursor-default";

  // Handle the click event
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    if (onClick) {
      onClick(subcategory);
    }
  };

  return (
    <Badge
      className={`${subcategoryClass} ${cursorClass} px-2 py-0.5 text-xs font-regular transition-colors`}
      onClick={isClickable ? handleClick : undefined}
      variant="outline"
    >
      {subcategory}
    </Badge>
  );
};

interface PropertyBadgeGroupProps {
  /**
   * The property category.
   */
  category: string;
  /**
   * Optional click handler for categories.
   */
  onCategoryClick?: (category: string) => void;
  /**
   * Optional click handler for subcategories.
   */
  onSubcategoryClick?: (subcategory: string) => void;
}

/**
 * Display a category badge and all its associated subcategory badges.
 */
export const PropertyBadgeGroup: React.FC<PropertyBadgeGroupProps> = ({
  category,
  onCategoryClick,
  onSubcategoryClick,
}) => {
  const subcategories = PROPERTY_TYPES.get(category) || [];

  return (
    <div className="flex flex-col gap-3">
      <PropertyCategoryBadge category={category} onClick={onCategoryClick} />
      <div className="flex flex-wrap gap-2 pl-4 border-l-2 border-gray-100 ml-2">
        {subcategories.map((subcategory) => (
          <PropertySubcategoryBadge
            key={subcategory}
            subcategory={subcategory}
            category={category}
            onClick={onSubcategoryClick}
          />
        ))}
      </div>
    </div>
  );
};

// --- AllPropertyBadges Component ---

interface AllPropertyBadgesProps {
  /**
   * Optional click handler for categories.
   */
  onCategoryClick?: (category: string) => void;
  /**
   * Optional click handler for subcategories.
   */
  onSubcategoryClick?: (subcategory: string) => void;
}

/**
 * Display all categories and their subcategories in groups.
 */
export const AllPropertyBadges: React.FC<AllPropertyBadgesProps> = ({
  onCategoryClick,
  onSubcategoryClick,
}) => {
  const categories = Array.from(PROPERTY_TYPES.keys());

  return (
    <div className="space-y-6">
      {categories.map((category) => (
        <PropertyBadgeGroup
          key={category}
          category={category}
          onCategoryClick={onCategoryClick}
          onSubcategoryClick={onSubcategoryClick}
        />
      ))}
    </div>
  );
};
