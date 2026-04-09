export type CartItem = {
  id:           string        // dish.id
  name:         string        // dish.name
  cuisine:      string        // dish.cuisine
  meal_type:    string        // dish.meal_type
  source_type:  string        // HOME_CHEF | CLOUD_KITCHEN | RESTAURANT
  source_id:    string        // for order creation
  source_name:  string        // display only
  price:        number        // regular price
  bulk_price:   number | null // bulk price if exists
  min_bulk_qty: number        // threshold for bulk pricing
  quantity:     number        // user selected quantity
  image_url:    string | null // for cart display
  diet_type:    string        // VEG | NON_VEG | etc.
  spice_level:  string        // for display in cart
  is_spicy:     boolean
  sub_items?: { id: string; name: string }[] // For MealBox/Combos
}

export type CartState = {
  items:          CartItem[]
  promoCode:      string | null
  promoDiscount:  number          // flat amount or percentage value
  promoType:      'flat' | 'percentage' | null
  deliveryFee:    number          // calculated based on items
  notes:          string          // special instructions (global)
}
