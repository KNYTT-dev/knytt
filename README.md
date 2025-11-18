# Knytt - AI-Powered Product Discovery Platform

A full-stack AI-powered product discovery platform with semantic search, personalized recommendations, and intelligent user interactions. Built with FastAPI, Next.js, PostgreSQL (Supabase), and CLIP embeddings.

## 🌟 Features

- **AI-Powered Search**: Semantic product search using CLIP embeddings and FAISS similarity search
- **Personalized Recommendations**: Context-aware recommendations based on user behavior and preferences
- **User Interactions**: Track views, clicks, likes, and purchases to improve personalization
- **Modern Frontend**: Beautiful, responsive UI built with Next.js 16 and Tailwind CSS
- **Real-time Updates**: React Query for efficient data fetching and caching
- **Production Ready**: Full authentication, error handling, and monitoring

## 📋 Requirements

- Python 3.12+
- Node.js 18+
- Supabase CLI (for local development)
- PostgreSQL 15+ with pgvector extension
- Redis 7+ (optional, for caching)

## 🚀 Quick Start

### 1. Install Supabase CLI

```bash
# Download Supabase CLI binary
curl -L https://github.com/supabase/cli/releases/download/v2.54.11/supabase_darwin_amd64.tar.gz -o /tmp/supabase.tar.gz
mkdir -p ~/bin
tar -xzf /tmp/supabase.tar.gz -C ~/bin
export PATH="$HOME/bin:$PATH"
```

### 2. Start Supabase

```bash
# Start local Supabase stack (PostgreSQL, Auth, Storage, Studio)
supabase start

# Access Supabase Studio at: http://localhost:54323
# PostgreSQL: postgresql://postgres:postgres@127.0.0.1:54322/postgres
```

### 3. Set Up Backend

```bash
# Create Python virtual environment
python3.12 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
pip install -r requirements-dev.txt  # For development tools

# Set up pre-commit hooks (catches formatting issues before commit)
pre-commit install

# Copy environment file
cp .env .env.local  # Edit if needed

# Create database schema
python create_db.py

# Start backend API
python -m uvicorn backend.api.main:app --host 0.0.0.0 --port 8001 --reload

# API will be available at: http://localhost:8001
# API Docs: http://localhost:8001/docs
```

### 4. Set Up Frontend

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.local.example .env.local

# Start frontend
npm run dev

# Frontend will be available at: http://localhost:3000
```

## 📁 Project Structure

```
knytt/
├── backend/                    # Python FastAPI backend
│   ├── api/                    # API routes and endpoints
│   │   ├── main.py            # FastAPI app entry point
│   │   ├── routers/           # API route handlers
│   │   │   ├── auth.py        # Authentication (login, register)
│   │   │   ├── search.py      # Product search
│   │   │   ├── recommend.py   # Recommendations
│   │   │   ├── feedback.py    # User interactions
│   │   │   └── users.py       # User management
│   │   ├── schemas/           # Pydantic request/response models
│   │   ├── dependencies.py    # Dependency injection
│   │   ├── security.py        # JWT auth, password hashing
│   │   └── middleware.py      # Request logging, timing
│   ├── db/                    # Database layer
│   │   ├── models.py          # SQLAlchemy ORM models
│   │   └── session.py         # Database connection
│   ├── ml/                    # Machine learning components
│   │   ├── retrieval.py       # FAISS index management
│   │   ├── search.py          # Search service
│   │   └── caching.py         # Embedding cache
│   └── celery/                # Background tasks (Celery)
├── frontend/                   # Next.js 16 frontend
│   ├── src/
│   │   ├── app/               # Next.js App Router pages
│   │   │   ├── page.tsx       # Home page
│   │   │   ├── search/        # Search page
│   │   │   ├── login/         # Login page
│   │   │   ├── register/      # Register page
│   │   │   ├── favorites/     # User favorites
│   │   │   ├── history/       # Interaction history
│   │   │   └── products/[id]/ # Product details
│   │   ├── components/        # React components
│   │   │   ├── layout/        # Header, Footer
│   │   │   ├── home/          # Hero, CategoryPills, MasonryGrid
│   │   │   ├── search/        # SearchFilters, SearchResults
│   │   │   ├── recommendations/ # RecommendationCarousel
│   │   │   ├── products/      # ProductCard, ProductGrid
│   │   │   ├── ui/            # Reusable UI components
│   │   │   └── providers/     # Context providers
│   │   ├── lib/               # Core utilities
│   │   │   ├── query-client.ts  # React Query config
│   │   │   ├── queries/         # Data fetching hooks
│   │   │   │   ├── auth.ts      # Auth queries (login, register, useAuth)
│   │   │   │   ├── search.ts    # Search queries
│   │   │   │   ├── recommendations.ts  # Recommendation queries
│   │   │   │   ├── feedback.ts  # Interaction tracking
│   │   │   │   └── user.ts      # User data queries
│   │   │   └── stores/          # Zustand state stores
│   │   │       └── cartStore.ts # Shopping cart
│   │   ├── types/             # TypeScript types
│   │   │   ├── api.ts         # API request/response types
│   │   │   ├── product.ts     # Product types
│   │   │   └── enums.ts       # Enums and constants
│   │   └── styles/            # Global styles
│   └── public/                # Static assets
├── supabase/                   # Supabase configuration
│   └── migrations/            # Database migrations (legacy)
├── create_db.py               # Database schema creation script
├── .env                       # Environment variables
└── README.md                  # This file
```

## 🗄️ Database Schema

The application uses 6 main tables:

- **users**: User accounts and authentication
- **user_embeddings**: ML-powered user preference embeddings
- **user_interactions**: Tracking user behavior (views, clicks, likes)
- **products**: Product catalog
- **product_embeddings**: Vector embeddings for products (512-dim CLIP)
- **task_executions**: Background job tracking

## 🔧 Development

### Backend Development

```bash
# Activate virtual environment
source venv/bin/activate

# Run backend with auto-reload
python -m uvicorn backend.api.main:app --host 0.0.0.0 --port 8001 --reload

# Create database schema
python create_db.py

# Access API docs
open http://localhost:8001/docs
```

### Frontend Development

```bash
cd frontend

# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linting
npm run lint

# Type check
npm run type-check
```

### Database Management

```bash
# Access Supabase Studio
open http://localhost:54323

# Connect to PostgreSQL directly
PGPASSWORD=postgres psql -h 127.0.0.1 -p 54322 -U postgres -d postgres

# Reset database (recreate schema)
python create_db.py
```

## 📈 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login and receive JWT tokens
- `POST /auth/logout` - Logout (clear cookies)
- `GET /auth/me` - Get current authenticated user
- `POST /auth/refresh` - Refresh access token

### Search & Discovery
- `POST /api/v1/search` - Semantic product search
- `POST /api/v1/recommend` - Personalized recommendations

### User Interactions
- `POST /api/v1/feedback` - Track user interactions (view, click, like, etc.)
- `GET /api/v1/users/{user_id}/stats` - User statistics
- `GET /api/v1/users/{user_id}/history` - Interaction history
- `GET /api/v1/users/{user_id}/favorites` - User favorites

### Health & Monitoring
- `GET /health` - Health check
- `GET /status` - Detailed system status
- `GET /metrics` - Performance metrics

## 🌐 Environment Variables

### Backend (.env)
```bash
# Supabase (Local)
SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_ANON_KEY=sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH
SUPABASE_SERVICE_KEY=sb_secret_N7UND0UgjKTVK-Uodkm0Hg_xSvEMPvz

# Database
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:54322/postgres

# API
API_HOST=0.0.0.0
API_PORT=8001

# Redis (Optional)
REDIS_HOST=localhost
REDIS_PORT=6379

# ML Configuration
CLIP_MODEL=ViT-B/32
EMBEDDING_DIMENSION=512
```

### Frontend (.env.local)
```bash
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH
NEXT_PUBLIC_API_URL=http://localhost:8001
```

## 🧪 Testing

```bash
# Backend tests
pytest tests/ -v

# Frontend tests
cd frontend
npm run test
```

## 🚢 Deployment

See [docs/deployment/README.md](docs/deployment/README.md) for deployment guides:

- Supabase Cloud + GCP Cloud Run (Recommended)
- Docker Compose (Development)
- Kubernetes (Production)

## 🔮 Features & Roadmap

### ✅ Completed
- [x] FastAPI backend with authentication
- [x] SQLAlchemy database models
- [x] Supabase integration (PostgreSQL, Auth)
- [x] Next.js 16 frontend with App Router
- [x] React Query for data fetching
- [x] Zustand for state management
- [x] User authentication (JWT)
- [x] Product search and recommendations
- [x] User interaction tracking
- [x] Responsive UI with Tailwind CSS

### 🚧 In Progress
- [ ] CLIP embeddings generation
- [ ] FAISS similarity search
- [ ] ML model integration

### 📋 Planned
- [ ] Image upload and processing
- [ ] Real-time notifications
- [ ] Social features (sharing, following)
- [ ] Analytics dashboard
- [ ] A/B testing framework
- [ ] Multi-language support

## 📚 Documentation

- [API Documentation](docs/api/README.md)
- [Architecture Overview](docs/architecture/README.md)
- [Deployment Guide](docs/deployment/README.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Install development dependencies and pre-commit hooks:
   ```bash
   pip install -r requirements-dev.txt
   pre-commit install
   ```
4. Make your changes (pre-commit hooks will auto-format on commit)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

**Note:** Pre-commit hooks will automatically run Black, isort, flake8, and other checks before each commit. This ensures code quality and prevents CI failures.

## 📄 License

MIT License - see LICENSE file for details

## 📞 Support

For questions and support, please open an issue in the repository.

---

Built with ❤️ using FastAPI, Next.js, and Supabase
