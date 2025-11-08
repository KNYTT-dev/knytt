# Knytt

**AI-Powered E-Commerce Product Discovery Platform**

Knytt is a modern product discovery platform that uses machine learning and semantic search to provide personalized product recommendations. Built with Supabase, GCP Cloud Run, and Cloudflare for maximum performance and scalability.

![Architecture](https://img.shields.io/badge/Architecture-Hybrid-blue)
![License](https://img.shields.io/badge/License-MIT-green)
![Python](https://img.shields.io/badge/Python-3.11+-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)

---

## 🚀 Features

### Core Features
- **Semantic Search** - Find products using natural language queries
- **Personalized Recommendations** - ML-powered suggestions based on user behavior
- **Vector Similarity** - CLIP embeddings for visual and text-based search
- **Real-time Updates** - Live product catalog updates
- **User Profiles** - Track preferences and interaction history
- **Smart Filtering** - Filter by category, price, availability, and quality

### Technical Features
- **PostgreSQL + pgvector** - Native vector storage and similarity search
- **Hybrid Architecture** - Supabase for data, GCP for compute
- **Scalable ML** - FAISS indices for fast similarity search
- **Background Workers** - Celery for async embedding generation
- **Modern Frontend** - Next.js 16 with React Server Components
- **Edge CDN** - Cloudflare for global distribution
- **Type-Safe** - End-to-end TypeScript + Python type hints

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│         Cloudflare (CDN + WAF + DNS)            │
└────────────┬────────────────────────┬───────────┘
             │                        │
    ┌────────▼────────┐      ┌───────▼────────┐
    │ Cloudflare Pages│      │  GCP Cloud Run  │
    │   (Next.js)     │      │    (FastAPI)    │
    │  - Frontend     │      │  - REST API     │
    │  - SSR/SSG      │      │  - ML Endpoints │
    └────────┬────────┘      └────────┬────────┘
             │                        │
             └────────┬───────────────┘
                      │
         ┌────────────▼─────────────┐
         │       Supabase           │
         │ ─────────────────────── │
         │ PostgreSQL + pgvector    │
         │ Authentication           │
         │ Storage (Images/Files)   │
         │ Realtime Subscriptions   │
         └──────────────────────────┘
                      ▲
                      │
         ┌────────────┴─────────────┐
         │   GCP Cloud Run Jobs     │
         │  ─────────────────────   │
         │  Celery Workers          │
         │  - Embedding Generation  │
         │  - FAISS Index Building  │
         │  - Data Ingestion        │
         └──────────────────────────┘
              ▲              ▲
              │              │
    ┌─────────┴────┐   ┌────┴────────┐
    │ Memorystore  │   │ Cloud       │
    │ (Redis)      │   │ Storage     │
    │ - Celery     │   │ - FAISS     │
    │ - Caching    │   │ - Indices   │
    └──────────────┘   └─────────────┘
```

---

## 📋 Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **PostgreSQL 15** - Relational database with pgvector extension
- **Supabase** - Backend-as-a-Service (Database, Auth, Storage)
- **Celery** - Distributed task queue
- **Redis** - Cache and message broker

### Machine Learning
- **CLIP (OpenAI)** - Vision-language embeddings (512 dimensions)
- **FAISS** - Facebook AI Similarity Search
- **scikit-learn** - ML utilities and preprocessing
- **PyTorch** - Deep learning framework

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript 5** - Type safety
- **Tailwind CSS v4** - Utility-first styling
- **Zustand** - State management
- **TanStack Query** - Data fetching and caching

### Infrastructure
- **GCP Cloud Run** - Serverless containers
- **GCP Memorystore** - Managed Redis
- **GCP Cloud Storage** - Object storage
- **Cloudflare Pages** - Static site hosting
- **Cloudflare CDN** - Global content delivery
- **Terraform** - Infrastructure as Code

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- Python 3.11+
- Docker
- Supabase CLI
- Google Cloud SDK (for deployment)

### Local Development

```bash
# 1. Clone the repository
git clone https://github.com/your-username/knytt.git
cd knytt

# 2. Set up environment variables
cp .env.example .env
# Edit .env with your values

# 3. Start Supabase locally
supabase start

# 4. Run database migrations
supabase db push

# 5. Install Python dependencies
pip install -r requirements.txt

# 6. Start the backend
cd backend
uvicorn api.main:app --reload

# 7. Install frontend dependencies (in new terminal)
cd frontend
npm install

# 8. Start the frontend
npm run dev
```

Visit http://localhost:3000 🎉

---

## 📦 Deployment

### Option 1: Quick Deploy (15 minutes)

Follow the [Quick Start Guide](./QUICK_START.md) for fastest deployment.

### Option 2: Full Deployment

Follow the comprehensive [Deployment Guide](./DEPLOYMENT_GUIDE.md) for production setup.

### Option 3: Automated CI/CD

Push to `main` branch and GitHub Actions will automatically deploy to:
- GCP Cloud Run (backend)
- Cloudflare Pages (frontend)
- Supabase (database migrations)

---

## 📁 Project Structure

```
knytt/
├── backend/                    # Python backend
│   ├── api/                    # FastAPI application
│   │   ├── routers/            # API endpoints
│   │   ├── models/             # Pydantic models
│   │   └── main.py             # App entry point
│   ├── ml/                     # Machine learning modules
│   │   ├── retrieval/          # Search & ranking
│   │   ├── user_modeling/      # User embeddings
│   │   └── model_loader.py     # CLIP model
│   └── tasks/                  # Celery tasks
│
├── frontend/                   # Next.js frontend
│   ├── src/
│   │   ├── app/                # App Router pages
│   │   ├── components/         # React components
│   │   ├── stores/             # Zustand stores
│   │   └── types/              # TypeScript types
│   └── package.json
│
├── supabase/                   # Supabase configuration
│   ├── migrations/             # Database migrations
│   │   ├── 20250107000001_initial_schema.sql
│   │   ├── 20250107000002_vector_search_functions.sql
│   │   └── 20250107000003_storage_setup.sql
│   └── config.toml             # Supabase config
│
├── deployment/                 # Deployment configuration
│   ├── gcp/                    # Terraform for GCP
│   │   ├── main.tf
│   │   └── terraform.tfvars.example
│   ├── docker/                 # Dockerfiles
│   │   ├── Dockerfile.api
│   │   └── Dockerfile.worker
│   └── scripts/                # Deployment scripts
│       ├── build-and-push.sh
│       └── deploy.sh
│
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD pipeline
│
├── requirements.txt            # Python dependencies
├── requirements-ml.txt         # ML dependencies
├── .env.example                # Environment variables template
├── DEPLOYMENT_GUIDE.md         # Full deployment guide
├── QUICK_START.md              # Quick start guide
└── README.md                   # This file
```

---

## 🔑 Key Components

### Database Schema

**Main Tables:**
- `products` - Product catalog with embeddings
- `user_profiles` - Extended user information
- `user_embeddings` - User taste profiles (long-term + session)
- `user_interactions` - Interaction tracking
- `user_favorites` - Saved products
- `search_queries` - Search analytics

### API Endpoints

```
POST   /api/v1/search              - Semantic product search
POST   /api/v1/recommend           - Personalized recommendations
GET    /api/v1/products/{id}       - Get product details
POST   /api/v1/feedback            - Track user interaction
GET    /api/v1/similar/{id}        - Similar products
POST   /api/v1/auth/login          - User login
POST   /api/v1/auth/register       - User registration
GET    /health                     - Health check
```

### Vector Search Functions

Custom PostgreSQL functions using pgvector:

- `match_products()` - Semantic similarity search
- `get_personalized_recommendations()` - User-based recommendations
- `get_similar_products()` - Product similarity
- `search_products_hybrid()` - Hybrid semantic + keyword search
- `get_trending_products()` - Trending based on interactions

---

## 🎯 Use Cases

1. **E-Commerce Discovery** - Help users find products they'll love
2. **Visual Search** - Find similar products by image
3. **Personalized Shopping** - Tailored recommendations
4. **Content Discovery** - Extend to articles, videos, etc.
5. **Product Recommendations** - Cross-sell and upsell

---

## 💰 Cost Estimate

### Development Environment
- **Total: ~$125/month**
  - GCP: ~$125
  - Supabase: Free
  - Cloudflare: Free

### Production Environment (10k DAU)
- **Total: ~$655/month**
  - GCP Cloud Run: $90
  - GCP Memorystore: $60
  - GCP Storage: $40
  - GCP Networking: $100
  - GCP Misc: $40
  - Supabase Pro: $25
  - Cloudflare Pro: $20
  - Vertex AI (optional): $150

### Scaling (100k DAU)
- **Total: ~$2000-3000/month**
  - Primarily increased compute and networking

---

## 🛠️ Development

### Running Tests

```bash
# Backend tests
pytest tests/ --cov=backend

# Frontend tests
cd frontend
npm test

# E2E tests
npm run test:e2e
```

### Code Quality

```bash
# Python
black backend/
isort backend/
flake8 backend/
mypy backend/

# TypeScript
cd frontend
npm run lint
npm run type-check
```

### Database Migrations

```bash
# Create a new migration
supabase migration new migration_name

# Apply migrations
supabase db push

# Reset database (local only)
supabase db reset
```

---

## 🔐 Security

- ✅ Row Level Security (RLS) enabled on all tables
- ✅ JWT-based authentication via Supabase
- ✅ API keys stored in Secret Manager
- ✅ HTTPS only (enforced by Cloudflare)
- ✅ WAF and DDoS protection (Cloudflare)
- ✅ Rate limiting on API endpoints
- ✅ Input validation with Pydantic
- ✅ SQL injection prevention via SQLAlchemy ORM

---

## 📊 Monitoring

### Available Metrics

- **GCP Cloud Monitoring**: CPU, memory, requests, latency
- **Supabase Dashboard**: Database performance, API usage
- **Cloudflare Analytics**: Traffic, security events, performance

### Logs

- **Application logs**: Cloud Logging (GCP)
- **Database logs**: Supabase dashboard
- **Edge logs**: Cloudflare (Pro plan)

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Write tests for new features
- Follow existing code style
- Update documentation
- Keep commits atomic and well-described

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **OpenAI** - CLIP model for embeddings
- **Supabase** - Amazing backend platform
- **Vercel** - Next.js framework
- **Facebook AI** - FAISS library
- **Cloudflare** - Edge infrastructure

---

## 📚 Documentation

- [Quick Start Guide](./QUICK_START.md) - Get started in 15 minutes
- [Deployment Guide](./DEPLOYMENT_GUIDE.md) - Comprehensive deployment instructions
- [API Documentation](./docs/API.md) - API reference (auto-generated)
- [Architecture](./docs/ARCHITECTURE.md) - System design details

---

## 🐛 Issues & Support

- **Bug reports**: [GitHub Issues](https://github.com/your-username/knytt/issues)
- **Feature requests**: [GitHub Discussions](https://github.com/your-username/knytt/discussions)
- **Questions**: [Stack Overflow](https://stackoverflow.com/questions/tagged/knytt)

---

## 🗺️ Roadmap

### Phase 1 (Current) ✅
- ✅ Core search and recommendations
- ✅ User authentication
- ✅ Product ingestion pipeline
- ✅ Vector similarity search
- ✅ Basic UI

### Phase 2 (In Progress)
- 🚧 Social features (likes, shares, follows)
- 🚧 Advanced filtering
- 🚧 Mobile app (React Native)
- 🚧 Admin dashboard

### Phase 3 (Planned)
- 📋 Fine-tuned CLIP model
- 📋 Multi-modal search (image + text)
- 📋 Collaborative filtering
- 📋 A/B testing framework
- 📋 Analytics dashboard

### Phase 4 (Future)
- 💭 AR/VR product visualization
- 💭 Voice search
- 💭 Multi-language support
- 💭 Marketplace features

---

## 🌟 Star History

If you find this project useful, please consider giving it a star ⭐

---

Made with ❤️ by the Knytt team
