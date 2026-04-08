export interface Dish {
  id: string;
  name: string;
  cuisine: string;
  meal_type: string;
  source_type: "HOME_CHEF" | "CLOUD_KITCHEN" | "RESTAURANT";
  source_id: string;
  price: number;
  bulk_price: number | null;
  min_bulk_qty: number;
  image_url: string | null;
  diet_type: "VEG" | "NON_VEG" | "EGG" | "VEGAN" | "JAIN";
  spice_level: "MILD" | "MEDIUM" | "SPICY" | "EXTRA_SPICY";
  is_spicy: boolean;
  description?: string;
  rating?: number;
  review_count?: number;
}
