# Knytt Frontend

AI-powered product discovery platform frontend built with Next.js 16, TypeScript, and Tailwind CSS.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v3.4
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query v5)
- **UI Components**: Custom components with Lucide icons
- **Code Quality**: ESLint + TypeScript

## Features

- **AI-Powered Search**: Semantic product search with filters
- **Personalized Recommendations**: Context-aware product suggestions
- **User Authentication**: JWT-based auth with httpOnly cookies
- **Interaction Tracking**: Track views, clicks, and likes
- **Responsive Design**: Mobile-first, works on all devices
- **Real-time Updates**: Optimistic updates with React Query
- **Shopping Cart**: Persistent cart using Zustand

## Project Structure

```
frontend/
├── src/
│   ├── app/                      # Next.js App Router pages
│   │   ├── page.tsx             # Home page (feed + discovery)
│   │   ├── layout.tsx           # Root layout with providers
│   │   ├── providers.tsx        # React Query + Auth providers
│   │   ├── search/              # Search page
│   │   ├── login/               # Login page
│   │   ├── register/            # Registration page
│   │   ├── favorites/           # User favorites
│   │   ├── history/             # Interaction history
│   │   ├── feed/                # Personalized feed
│   │   ├── settings/            # User settings
│   │   └── products/[id]/       # Product detail page
│   ├── components/              # React components
│   │   ├── layout/              # Layout components
│   │   │   ├── Header.tsx       # Navigation header
│   │   │   └── Footer.tsx       # Site footer
│   │   ├── home/                # Home page components
│   │   │   ├── HeroSection.tsx
│   │   │   ├── CategoryPills.tsx
│   │   │   └── MasonryGrid.tsx
│   │   ├── search/              # Search components
│   │   │   ├── SearchFilters.tsx
│   │   │   └── SearchResults.tsx
│   │   ├── recommendations/     # Recommendation components
│   │   │   └── RecommendationCarousel.tsx
│   │   ├── products/            # Product components
│   │   │   ├── ProductCard.tsx
│   │   │   └── ProductGrid.tsx
│   │   ├── ui/                  # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Toast.tsx
│   │   │   ├── Tooltip.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   └── ScrollToTop.tsx
│   │   └── providers/           # Context providers
│   │       └── AuthProvider.tsx
│   ├── lib/                     # Core utilities
│   │   ├── query-client.ts      # React Query configuration
│   │   ├── queries/             # Data fetching hooks
│   │   │   ├── auth.ts          # useAuth, useLogin, useRegister, useLogout
│   │   │   ├── search.ts        # useSearch, useInfiniteSearch
│   │   │   ├── recommendations.ts # useFeed, useSimilarProducts
│   │   │   ├── feedback.ts      # useTrackInteraction, useTrackView
│   │   │   └── user.ts          # useUserStats, useFavorites, useInteractionHistory
│   │   └── stores/              # Zustand state stores
│   │       └── cartStore.ts     # Shopping cart store
│   ├── types/                   # TypeScript type definitions
│   │   ├── api.ts               # API request/response types
│   │   ├── product.ts           # Product-related types
│   │   └── enums.ts             # Enums (InteractionType, etc.)
│   └── styles/                  # Global styles
│       └── globals.css          # Tailwind imports and custom CSS
└── public/                      # Static assets
    └── favicon.ico
```

## Getting Started

### Prerequisites

- Node.js 18+
- Backend API running on http://localhost:8001
- Supabase running locally (for auth)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.local.example .env.local
   ```

   Edit `.env.local`:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH
   NEXT_PUBLIC_API_URL=http://localhost:8001
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   ```
   http://localhost:3000
   ```

## Available Scripts

- `npm run dev` - Start development server on port 3000
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Key Features

### Authentication

The app uses JWT authentication with httpOnly cookies:

```typescript
import { useAuth, useLogin, useLogout } from "@/lib/queries/auth";

function MyComponent() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const login = useLogin();
  const logout = useLogout();

  // Login
  login.mutate({ email, password });

  // Logout
  logout.mutate();
}
```

### Product Search

Search products with semantic search and filters:

```typescript
import { useSearch } from "@/lib/queries/search";

function SearchPage() {
  const { data, isLoading } = useSearch({
    query: "summer dresses",
    limit: 20,
    filters: {
      price_min: 20,
      price_max: 100,
      categories: ["fashion", "women"]
    }
  });

  return data?.results.map(product => <ProductCard product={product} />);
}
```

### Recommendations

Get personalized product recommendations:

```typescript
import { useFeed } from "@/lib/queries/recommendations";

function FeedPage() {
  const { user } = useAuth();
  const { data, isLoading } = useFeed(user?.id, {
    limit: 20,
    context: "feed"
  });

  return <RecommendationCarousel products={data?.results} />;
}
```

### Interaction Tracking

Track user interactions to improve recommendations:

```typescript
import { useTrackInteraction } from "@/lib/queries/feedback";

function ProductCard({ product }) {
  const track = useTrackInteraction();

  const handleClick = () => {
    track.mutate({
      user_id: userId,
      product_id: product.id,
      interaction_type: "click",
      context: "search_results"
    });
  };
}
```

### Shopping Cart

Persistent shopping cart using Zustand:

```typescript
import { useCartStore } from "@/lib/stores/cartStore";

function AddToCartButton({ product }) {
  const addItem = useCartStore((state) => state.addItem);
  const cartItemCount = useCartStore((state) => state.getItemCount());

  return (
    <button onClick={() => addItem(product)}>
      Add to Cart ({cartItemCount})
    </button>
  );
}
```

## Environment Variables

### Required

- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `NEXT_PUBLIC_API_URL` - Backend API URL

### Optional

- `NEXT_PUBLIC_GA_TRACKING_ID` - Google Analytics tracking ID
- `NEXT_PUBLIC_SENTRY_DSN` - Sentry error tracking DSN

## Pages

### Public Pages
- `/` - Home page with hero, categories, and product discovery
- `/search` - Product search with filters
- `/products/[id]` - Product detail page
- `/login` - User login
- `/register` - User registration

### Protected Pages (require authentication)
- `/favorites` - User's favorite products
- `/history` - Interaction history
- `/feed` - Personalized product feed
- `/settings` - User preferences and settings

## Components

### Layout Components
- `Header` - Navigation with search, cart, and user menu
- `Footer` - Site footer with links and info

### Product Components
- `ProductCard` - Individual product card with image, price, actions
- `ProductGrid` - Responsive grid of products
- `MasonryGrid` - Pinterest-style masonry layout

### UI Components
- `Button` - Styled button with variants
- `Input` - Form input with validation
- `Toast` - Toast notifications
- `Tooltip` - Hover tooltips
- `Modal` - Modal dialogs
- `ProgressBar` - Loading progress indicator
- `ScrollToTop` - Scroll to top button

## Styling

The app uses Tailwind CSS with a custom color palette:

```css
/* Primary Colors */
--color-pinterest-red: #E60023
--color-dark-red: #AD081B
--color-ivory: #FAF9F6
--color-blush: #FFE5E5

/* Neutral Colors */
--color-charcoal: #2B2B2B
--color-gray: #767676
--color-light-gray: #E0E0E0

/* Accent Colors */
--color-sage: #9CAF88
--color-evergreen: #2F5233
--color-terracotta: #D4856A
```

## API Integration

The frontend connects to the Knytt backend API:

- **Base URL**: http://localhost:8001
- **Docs**: http://localhost:8001/docs

All API calls use React Query for caching, optimistic updates, and error handling.

## Development

### Adding a New Page

1. Create page in `src/app/[page-name]/page.tsx`
2. Add types in `src/types/`
3. Create API hooks in `src/lib/queries/`
4. Build components in `src/components/`

### Adding a New Query Hook

```typescript
// src/lib/queries/example.ts
import { useQuery } from "@tanstack/react-query";

export function useExample() {
  return useQuery({
    queryKey: ["example"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/v1/example`);
      return res.json();
    },
  });
}
```

## Build & Deployment

```bash
# Build for production
npm run build

# Start production server
npm run start

# Export static site (if applicable)
npm run build && npm run export
```

## Troubleshooting

### Port 3000 already in use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill
```

### Module not found errors
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
```

### Hot reload not working
```bash
# Restart dev server
rm -rf .next
npm run dev
```

## Contributing

1. Follow the existing code structure
2. Use TypeScript types for all new code
3. Test all changes locally before committing
4. Run `npm run lint` and `npm run type-check` before pushing

## License

MIT License - see LICENSE file for details
