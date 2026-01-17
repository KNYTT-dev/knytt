# Deployment Overview

This document provides a comprehensive summary of the Knytt deployment infrastructure across Google Cloud, Cloudflare, and Supabase.

## Architecture Overview

```
                              ┌──────────────────────────────────────────────────────┐
                              │                      GitHub                          │
                              │  ┌────────────────────────────────────────────────┐  │
                              │  │              GitHub Actions CI/CD              │  │
                              │  │  • Build Docker images                         │  │
                              │  │  • Run Terraform                               │  │
                              │  │  • Run database migrations                     │  │
                              │  └────────────────────────────────────────────────┘  │
                              └───────────────┬────────────────┬─────────────────────┘
                                              │                │
                         ┌────────────────────┘                └────────────────────┐
                         │                                                          │
                         ▼                                                          ▼
┌─────────────────────────────────────────┐              ┌─────────────────────────────────────┐
│            Google Cloud (GCP)           │              │           Cloudflare Pages          │
│  ┌───────────────────────────────────┐  │              │  ┌─────────────────────────────┐    │
│  │  Artifact       Cloud Run         │  │              │  │   Next.js Frontend          │    │
│  │  Registry  ───▶ (API + Workers)   │  │              │  │   • Static assets           │    │
│  └───────────────────────────────────┘  │              │  │   • Preview deployments     │    │
│  ┌───────────────────────────────────┐  │              │  └─────────────────────────────┘    │
│  │  Secret Manager │ Cloud Storage   │  │              └─────────────────────────────────────┘
│  │  (Credentials)  │ (ML Artifacts)  │  │                                │
│  └───────────────────────────────────┘  │                                │
│  ┌───────────────────────────────────┐  │                                │
│  │  Memorystore Redis (Task Queue)   │  │                                │
│  └───────────────────────────────────┘  │                                │
└───────────────────┬─────────────────────┘                                │
                    │                                                      │
                    │         ┌────────────────────────────────────────────┘
                    │         │
                    ▼         ▼
          ┌─────────────────────────────────────┐
          │              Supabase               │
          │  ┌─────────────────────────────┐    │
          │  │  PostgreSQL + pgvector      │    │
          │  │  • Database                 │    │
          │  │  • Authentication           │    │
          │  │  • Storage buckets          │    │
          │  └─────────────────────────────┘    │
          └─────────────────────────────────────┘
```

### Deployment Flow

1. **Code Push** → Developer pushes to GitHub (`main`, `staging`, or `develop`)
2. **GitHub Actions** → Triggers CI/CD workflow (`.github/workflows/deploy.yml`)
3. **Build** → Docker images built and pushed to GCP Artifact Registry
4. **Infrastructure** → Terraform provisions/updates GCP resources
5. **Deploy Backend** → Cloud Run services updated with new images
6. **Migrate** → Supabase database migrations applied
7. **Deploy Frontend** → Cloudflare Pages builds and deploys Next.js app
8. **Smoke Test** → Health endpoints verified

---

## 1. Google Cloud Platform (GCP)

### Services Used

| Service | Purpose |
|---------|---------|
| Cloud Run | Backend API + Celery Workers |
| Artifact Registry | Docker image storage |
| Secret Manager | Credentials storage (11 secrets) |
| Memorystore Redis | Task queue & caching |
| Cloud Storage | ML artifacts (FAISS indices) |
| Cloud Scheduler | Periodic embedding jobs |

### Key Configuration Files

- **Terraform (Simple):** `terraform/` - Basic Cloud Run setup
- **Terraform (Advanced):** `deployment/gcp/main.tf` - Full infrastructure with Redis, VPC, workers
- **Dockerfiles:** `deployment/docker/Dockerfile.api` and `Dockerfile.worker`
- **CI/CD:** `.github/workflows/deploy.yml`

### Production Settings

- **Project:** `knytt-backend`
- **Region:** `us-central1`
- **API URL:** `https://knytt-backend-144853975423.us-central1.run.app`
- **Resources:** 2 CPU, 8Gi memory (API); 4 CPU, 8Gi (workers)
- **Scaling:** 1-10 instances (prod), 0-3 (dev)

### Authentication

Uses **Workload Identity Federation** for GitHub Actions (no service account keys needed).

### Secrets Managed

The following secrets are stored in Google Secret Manager:

1. `database-url`
2. `supabase-url`
3. `supabase-anon-key`
4. `supabase-service-key`
5. `jwt-secret-key`
6. `jwt-algorithm`
7. `cors-origins`
8. `clip-model`
9. `embedding-dimension`
10. `environment`
11. `hf-token`

---

## 2. Cloudflare Pages

### Configuration

- **Config file:** `frontend/wrangler.toml`
- **Project name:** `knytt-frontend`
- **Build output:** `.vercel/output/static`
- **Compatibility date:** 2024-09-23

### Environment Variables Required

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_API_URL
NODE_VERSION (18+)
```

### Features

- Automatic preview deployments for branches/PRs
- Custom domain support with CNAME records
- Web Analytics integration
- Security headers configuration

### Documentation

Detailed guide at `docs/deployment/cloudflare-pages.md` covering custom domains, CORS, preview deployments, and security headers.

---

## 3. Supabase

### Configuration

- **Project ref:** `ezdqpxngwndxzubxekgz`
- **URL:** `https://ezdqpxngwndxzubxekgz.supabase.co`
- **Database:** PostgreSQL via connection pooler (port 6543)
- **Region:** `aws-1-us-east-2`

### Features Used

- PostgreSQL with pgvector extension
- Row-Level Security (RLS)
- Storage buckets for product images
- Authentication (email provider)
- Connection pooling

### Migration Files

Located in `supabase/migrations/` directory.

---

## 4. CI/CD Pipeline

### Workflow: `.github/workflows/deploy.yml`

**Stages:**

1. **Setup** - Determine environment from branch
2. **Test** - Run tests (PRs only)
3. **Build** - Docker images to Artifact Registry
4. **Deploy Infrastructure** - Terraform apply
5. **Migrate** - Supabase database migrations
6. **Smoke Test** - Health endpoint verification
7. **Notify** - Deployment status

**Triggers:**

- Push to `main` (prod), `staging`, `develop` (dev)
- Pull requests
- Manual workflow dispatch

### Required GitHub Secrets

```
GCP_WORKLOAD_IDENTITY_PROVIDER
GCP_SERVICE_ACCOUNT
GCP_PROJECT_ID
SUPABASE_URL
SUPABASE_PROJECT_REF
SUPABASE_SERVICE_KEY
DATABASE_URL
HF_TOKEN
```

---

## 5. Documentation Index

| File | Content |
|------|---------|
| `docs/deployment/README.md` | Main deployment guide |
| `docs/deployment/gcp-cloud-run.md` | GCP setup guide |
| `docs/deployment/cloudflare-pages.md` | Frontend deployment |
| `docs/deployment/supabase.md` | Database setup |
| `terraform/README.md` | Terraform usage |
| `DEPLOYMENT_CHECKLIST.md` | Verification checklist |

---

## 6. Quick Deployment Commands

### GCP Terraform Deployment

```bash
cd deployment/gcp
terraform init
terraform plan -var-file=terraform.tfvars
terraform apply
```

### Manual Cloud Run Deployment

```bash
gcloud run deploy knytt-api \
  --image us-central1-docker.pkg.dev/knytt-backend/knytt/knytt-api:latest \
  --region us-central1
```

### Supabase Migrations

```bash
supabase db push
```

### Docker Build (Local)

```bash
docker build -f deployment/docker/Dockerfile.api -t knytt-api .
docker build -f deployment/docker/Dockerfile.worker -t knytt-worker .
```

---

## 7. Local Development

### Docker Compose

```bash
docker-compose up -d
```

Services started:
- PostgreSQL 15 with pgvector (port 5432)
- Redis 7 (port 6379)
- FastAPI backend (port 8000)
- Celery worker
- Celery Beat scheduler

---

## 8. Environment Files

| File | Purpose |
|------|---------|
| `.env.example` | Template with all variables |
| `.env.cloudrun` | Cloud Run production config |
| `.env.cloudrun.yaml` | YAML format for Cloud Run |
| `frontend/.env.production` | Frontend production vars |
| `frontend/.env.local` | Frontend local development |

---

## 9. Security Considerations

- Use Workload Identity Federation instead of service account keys
- Store all secrets in Google Secret Manager
- Enable Row-Level Security (RLS) in Supabase
- Configure CORS origins explicitly
- Use connection pooling for database connections
- Rotate credentials regularly
