Plattr

Plattr is a B2B2C food supply platform that connects home chefs, cloud kitchens, 
and restaurant partners into a unified food delivery network. It serves individuals 
ordering daily tiffin meals, corporates placing bulk recurring orders, and event 
organizers requiring large-scale catering — all through a single system.

The platform is not a food marketplace. It is a coordinated supply pipeline where 
food moves from a verified source through a quality-checked process to the customer.


---


What This Application Does

Customers can browse a catalog of dishes grouped by regional cuisine, filter by meal 
type, diet preference, and source type, and add items to a persistent cart. They can 
apply promo codes, proceed to checkout, and place real orders that are stored in the 
database. After placing an order, customers can track its status through a personal 
dashboard that also manages subscriptions and profile settings.

On the supply side, the platform surfaces home chef profiles, cloud kitchen 
operations, and restaurant partner pages — each with their own dish listings, 
ratings, and availability information.

Corporate and event buyers have a dedicated inquiry path that submits directly to 
the business client database, triggering a follow-up from the Plattr team.


---


Tech Stack

Frontend
  React with TypeScript
  Tailwind CSS for styling
  Framer Motion for animations
  React Router v6 for navigation
  Lucide React for icons

Backend and Database
  Supabase for database, authentication, and real-time features
  PostgreSQL via Supabase with row-level security enabled

State Management
  React Context for cart and authentication state
  localStorage for cart persistence across sessions

Fonts
  Playfair Display for headings
  Inter for body text and UI elements


---


Project Structure

src/
  components/
    cart/           Cart drawer, cart item row, cart button for navbar
    landing/        All landing page sections as individual components
    layout/         Navbar, footer, layout wrapper, protected route
    ui/             Shared components used across all pages
  context/
    CartContext     Cart state, actions, and computed values
    ToastContext    Global notification system
    AuthContext     Authentication state and session management
  hooks/            Custom data fetching hooks for each Supabase table
  pages/            One file per route
    dashboard/      Customer dashboard sub-pages
  types/            TypeScript type definitions
  utils/            Helper functions for formatting and source resolution
  lib/              Supabase client initialization


---


Pages and Routes

Public routes accessible without authentication

  /                     Landing page with all sections
  /catalog              Full dish catalog with filters
  /catalog/:cuisineSlug Catalog pre-filtered by cuisine
  /dish/:id             Individual dish detail with ordering
  /chefs                All home chefs browse page
  /chefs/:id            Chef profile with dishes and reviews
  /kitchens             Cloud kitchens overview
  /kitchens/:id         Kitchen detail with capacity and dishes
  /restaurants          Restaurant partners listing
  /restaurants/:id      Restaurant detail with menu and reviews
  /how-it-works         Detailed system explanation
  /for-business         B2B landing page with inquiry form
  /contact              General contact page
  /faq                  Frequently asked questions
  /menu                 Redirects to catalog
  /blog                 Coming soon placeholder
  /privacy-policy       Privacy policy
  /terms                Terms of service
  /login                Authentication
  /signup               Account creation

Protected routes requiring authentication

  /dashboard                  Overview with order stats
  /dashboard/orders           Order history
  /dashboard/orders/:id       Order detail with status timeline
  /dashboard/subscriptions    Active tiffin subscriptions
  /dashboard/profile          Profile and account settings


---


Database Tables

The Supabase database contains the following tables. All tables include 
created_at and deleted_at columns. Deleted records are soft-deleted and 
excluded from all queries using a deleted_at is null filter.

  profiles          Extends Supabase auth users with name, phone, city, role
  chefs             Home chef records with region, specialty, rating, availability
  kitchens          Cloud kitchen records with location and daily capacity
  restaurants       Restaurant partner records with brand and cuisine info
  dishes            Dish catalog linking to chefs, kitchens, or restaurants
  dish_ingredients  Ingredient list per dish including allergen flags
  chef_cuisines     Junction table mapping chefs to cuisine types
  kitchen_chefs     Junction table mapping chefs to kitchens
  chef_availability Weekly schedule slots per chef
  kitchen_capacity_slots Date-level capacity tracking per kitchen
  delivery_zones    Serviceable pincodes per source
  reviews           Ratings and comments for dishes, chefs, and restaurants
  orders            Customer order records with status and payment info
  order_items       Line items within each order
  subscriptions     Recurring tiffin plan records per customer
  b2b_clients       Corporate and institutional buyer records
  promotions        Promo codes with discount rules and usage limits


---


Cart System

Cart state is managed in React Context and persisted to localStorage so items 
survive page refresh. The cart holds an array of items, each capturing the dish 
details, quantity, and effective price at the time of adding.

Computed values update reactively. Subtotal is calculated using bulk pricing 
automatically when item quantity meets the minimum bulk threshold. Delivery fee 
is waived above five hundred rupees. GST is applied at five percent on the 
taxable amount after discount and delivery.

The promo code system validates against the promotions table in Supabase, 
checking the code is active, within its valid date range, above the minimum 
order value, and within its usage limit before applying the discount.

Orders are created as a single transaction writing to both the orders table and 
the order_items table. If the items insert fails after a successful order insert, 
the orphaned order record is deleted before surfacing the error to the user.


---


Authentication

Authentication uses Supabase Auth with email and password. After signup, a 
corresponding row is inserted into the profiles table to store additional user 
information beyond what the auth system holds.

Protected routes use a wrapper component that reads the current session. 
Unauthenticated users are redirected to the login page with a redirect parameter 
capturing their intended destination. After login, they are sent to that destination 
rather than the default dashboard.


---


Running Locally

Prerequisites
  Node.js version 18 or higher
  A Supabase project with the schema applied

Setup steps

  Clone the repository and install dependencies

    npm install

  Create a .env file in the root directory with your Supabase credentials

    VITE_SUPABASE_URL=your_supabase_project_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

  Apply the database schema by running the SQL file in the Supabase SQL editor
  The schema file includes all table definitions, indexes, RLS policies, 
  triggers, and seed data

  Start the development server

    npm run dev

  The application will be available at localhost:5173


---


Environment Variables

  VITE_SUPABASE_URL       Your Supabase project URL
  VITE_SUPABASE_ANON_KEY  Your Supabase anonymous public key

These are the only environment variables required. Never commit these values 
to version control. The .env file is included in .gitignore by default in 
Vite projects.


---


Key Design Decisions

Polymorphic dish source
  Each dish in the catalog links to either a chef, a kitchen, or a restaurant 
  through a source_type and source_id pair rather than three separate foreign keys. 
  A utility function resolves the correct table at query time. This allows the 
  catalog to be a unified view across all supply sources without multiple joins.

Cart as context with localStorage
  The cart does not write to the database until checkout. This keeps the cart fast 
  and reduces database load. The tradeoff is that carts are device-specific and 
  do not sync across sessions. This is acceptable at the current product stage.

Soft deletes everywhere
  No production data is hard-deleted. Every table has a deleted_at column. 
  All queries filter for deleted_at is null. This preserves order history integrity 
  even when dishes, chefs, or restaurants are removed from the platform.

No global state library
  The application uses React Context for the two pieces of state that need to be 
  globally accessible, the cart and the authentication session. All other state is 
  local to the component or page that owns it. No Redux, Zustand, or similar library 
  is used.

Framer Motion only for animation
  All motion in the application uses Framer Motion. No other animation library is 
  present. This keeps the animation API consistent and the bundle focused.


---


What Is Not Yet Built

The following items are noted for future development and are not part of the 
current implementation.

  Real payment processing — orders are created with payment status pending. 
  No payment gateway integration exists. The team follows up manually.

  Real-time order tracking — order status is updated manually in the database. 
  No push notifications or live tracking exists.

  Chef onboarding flow — chefs are currently added directly to the database. 
  There is no self-registration or onboarding form for new chefs.

  Review submission — reviews can be read from the database but there is no 
  in-app form for customers to submit reviews after an order.

  Subscription delivery scheduling — subscriptions are recorded but daily 
  order generation from active subscriptions is not automated.

  Admin dashboard — there is no internal tool for managing orders, chefs, 
  or customers. All management happens directly in the Supabase dashboard.


---


License

This project is proprietary. All rights reserved by the Plattr team.