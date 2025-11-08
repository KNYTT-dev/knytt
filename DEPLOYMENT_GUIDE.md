# Knytt Deployment Guide
## Supabase + GCP Cloud Run + Cloudflare Architecture

This guide walks you through deploying Knytt using the hybrid Supabase + GCP architecture.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Prerequisites](#prerequisites)
3. [Local Development Setup](#local-development-setup)
4. [Supabase Setup](#supabase-setup)
5. [GCP Setup](#gcp-setup)
6. [Cloudflare Setup](#cloudflare-setup)
7. [Deployment](#deployment)
8. [Post-Deployment](#post-deployment)
9. [Monitoring & Maintenance](#monitoring--maintenance)
10. [Troubleshooting](#troubleshooting)
11. [Cost Optimization](#cost-optimization)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────┐
│            Cloudflare (CDN + WAF)               │
└────────────┬────────────────────────┬───────────┘
             │                        │
    ┌────────▼────────┐      ┌───────▼────────┐
    │ Cloudflare Pages│      │  GCP Cloud Run  │
    │   (Next.js)     │      │    (FastAPI)    │
    └────────┬────────┘      └────────┬────────┘
             │                        │
             └────────┬───────────────┘
                      │
         ┌────────────▼─────────────┐
         │       Supabase           │
         │ - PostgreSQL + pgvector  │
         │ - Auth                   │
         │ - Storage                │
         └──────────────────────────┘
                      ▲
                      │
         ┌────────────┴─────────────┐
         │   GCP Cloud Run Jobs     │
         │  (ML Workers)            │
         └──────────────────────────┘
```

**Components:**
- **Supabase**: Database, Authentication, Storage
- **GCP Cloud Run**: FastAPI backend + ML workers
- **GCP Memorystore**: Redis for Celery
- **GCS**: FAISS indices storage
- **Cloudflare Pages**: Next.js frontend
- **Cloudflare**: CDN, WAF, DNS

---

## Prerequisites

### Required Accounts

1. **Supabase Account** (Free tier available)
   - Sign up at https://supabase.com

2. **Google Cloud Platform Account**
   - Sign up at https://cloud.google.com
   - Enable billing (free tier: $300 credit)

3. **Cloudflare Account** (Free tier available)
   - Sign up at https://cloudflare.com

4. **GitHub Account** (for CI/CD)
   - Sign up at https://github.com

### Required Tools

Install these tools on your local machine:

```bash
# Supabase CLI
npm install -g supabase

# Google Cloud SDK
# macOS:
brew install --cask google-cloud-sdk
# Linux/Windows: https://cloud.google.com/sdk/docs/install

# Terraform
# macOS:
brew install terraform
# Linux/Windows: https://www.terraform.io/downloads

# Docker
# Install from: https://docs.docker.com/get-docker/

# Node.js 20+ and npm
# macOS:
brew install node@20
# Or download from: https://nodejs.org/

# Python 3.11+
# macOS:
brew install python@3.11
```

### Verify Installations

```bash
supabase --version
gcloud --version
terraform --version
docker --version
node --version
python3 --version
```

---

## Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/knytt.git
cd knytt
```

### 2. Set Up Environment Variables

```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your values
nano .env
```

### 3. Start Local Supabase

```bash
# Initialize Supabase (first time only)
supabase init

# Start local Supabase stack
supabase start

# This will output:
# - API URL
# - GraphQL URL
# - DB URL
# - Studio URL
# - Inbucket URL (for emails)
# - JWT secret
# - anon key
# - service_role key
```

Copy these values to your `.env` file.

### 4. Run Database Migrations

```bash
# Apply migrations
supabase db push

# Or run individual migrations
supabase migration up
```

### 5. Start the Backend

```bash
# Install Python dependencies
pip install -r requirements.txt

# Start FastAPI server
cd backend
uvicorn api.main:app --reload --port 8000
```

### 6. Start the Frontend

```bash
# Install Node dependencies
cd frontend
npm install

# Start Next.js dev server
npm run dev
```

Visit http://localhost:3000 to see the app!

---

## Supabase Setup

### 1. Create a Supabase Project

1. Go to https://app.supabase.com
2. Click "New Project"
3. Fill in:
   - **Name**: knytt-prod (or knytt-dev)
   - **Database Password**: Generate a strong password
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free (or Pro for production)

### 2. Get Your Credentials

Once the project is created:

1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (e.g., https://xxx.supabase.co)
   - **Project API keys**:
     - `anon` key (public)
     - `service_role` key (secret - never expose!)

3. Go to **Settings** → **Database**
4. Copy the **Connection string** (for direct PostgreSQL access)

### 3. Run Migrations on Production

```bash
# Link to your Supabase project
supabase link --project-ref YOUR_PROJECT_REF

# Apply migrations
supabase db push

# Verify tables were created
supabase db diff
```

### 4. Configure Storage Buckets

Storage buckets are created automatically via the migration `20250107000003_storage_setup.sql`.

Verify in Supabase Dashboard:
1. Go to **Storage**
2. You should see:
   - `product-images` (public)
   - `avatars` (public)
   - `data-uploads` (private)
   - `ml-models` (private)

### 5. Enable Realtime (Optional)

If you want real-time features:

1. Go to **Database** → **Replication**
2. Enable replication for tables you want to subscribe to

### 6. Configure Auth Providers (Optional)

To enable social login:

1. Go to **Authentication** → **Providers**
2. Enable providers (Google, GitHub, etc.)
3. Add OAuth credentials

---

## GCP Setup

### 1. Create a GCP Project

```bash
# Create a new project
gcloud projects create knytt-prod --name="Knytt Production"

# Set as active project
gcloud config set project knytt-prod

# Enable billing (required)
# Go to: https://console.cloud.google.com/billing
```

### 2. Enable Required APIs

```bash
# Enable APIs
gcloud services enable \
  artifactregistry.googleapis.com \
  run.googleapis.com \
  redis.googleapis.com \
  secretmanager.googleapis.com \
  vpcaccess.googleapis.com \
  cloudscheduler.googleapis.com \
  storage-api.googleapis.com \
  compute.googleapis.com
```

### 3. Set Up Authentication for Terraform

```bash
# Create a service account
gcloud iam service-accounts create terraform-sa \
  --display-name="Terraform Service Account"

# Grant necessary roles
gcloud projects add-iam-policy-binding knytt-prod \
  --member="serviceAccount:terraform-sa@knytt-prod.iam.gserviceaccount.com" \
  --role="roles/editor"

# Create and download key
gcloud iam service-accounts keys create terraform-key.json \
  --iam-account=terraform-sa@knytt-prod.iam.gserviceaccount.com

# Set as default credentials
export GOOGLE_APPLICATION_CREDENTIALS="./terraform-key.json"
```

### 4. Configure Terraform Variables

```bash
cd deployment/gcp

# Copy example vars
cp terraform.tfvars.example terraform.tfvars

# Edit with your values
nano terraform.tfvars
```

Update these values:
```hcl
project_id  = "knytt-prod"
region      = "us-central1"
environment = "prod"

supabase_url         = "https://xxx.supabase.co"
supabase_service_key = "your-service-role-key"
supabase_anon_key    = "your-anon-key"
```

---

## Cloudflare Setup

### 1. Add Your Domain

1. Go to https://dash.cloudflare.com
2. Click "Add a Site"
3. Enter your domain (e.g., knytt.com)
4. Choose a plan (Free is fine to start)
5. Update nameservers at your domain registrar

### 2. Configure DNS Records

Once domain is active:

1. **API subdomain** (points to GCP Cloud Run):
   ```
   Type: CNAME
   Name: api
   Target: ghs.googlehosted.com (temporary - will update after deployment)
   Proxy: ON (orange cloud)
   TTL: Auto
   ```

2. **App subdomain** (points to Cloudflare Pages):
   ```
   Type: CNAME
   Name: app
   Target: <your-pages-domain>.pages.dev
   Proxy: ON
   TTL: Auto
   ```

3. **Root domain** (redirects to app):
   ```
   Type: CNAME
   Name: @
   Target: app.knytt.com
   Proxy: ON
   TTL: Auto
   ```

### 3. Configure Cloudflare Pages

1. Go to **Pages** → **Create a project**
2. Connect your GitHub repository
3. Configure build settings:
   - **Framework preset**: Next.js
   - **Build command**: `npm run build`
   - **Build output directory**: `.next`
   - **Root directory**: `frontend`

4. Add environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   NEXT_PUBLIC_API_URL=https://api.knytt.com
   ```

5. Click **Save and Deploy**

### 4. Configure Security (WAF)

1. Go to **Security** → **WAF**
2. Enable **OWASP Core Ruleset**
3. Create custom rules:

**Rate limiting for API:**
```
(http.host eq "api.knytt.com" and http.request.uri.path contains "/api/")
Rate: 100 requests per 1 minute
```

**Block bad bots:**
```
(cf.bot_management.score lt 30)
Action: Challenge
```

### 5. Configure SSL/TLS

1. Go to **SSL/TLS**
2. Set encryption mode to **Full (strict)**
3. Enable:
   - Always Use HTTPS
   - Automatic HTTPS Rewrites
   - Minimum TLS Version: 1.2

---

## Deployment

### Option A: Automated Deployment (GitHub Actions)

#### 1. Configure GitHub Secrets

Go to your repository → **Settings** → **Secrets and variables** → **Actions**

Add these secrets:

**GCP:**
```
GCP_PROJECT_ID=knytt-prod
GCP_WORKLOAD_IDENTITY_PROVIDER=projects/.../providers/github
GCP_SERVICE_ACCOUNT=github-actions@knytt-prod.iam.gserviceaccount.com
```

**Supabase:**
```
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_PROJECT_REF=your-project-ref
SUPABASE_ACCESS_TOKEN=your-access-token
```

**Cloudflare:**
```
CLOUDFLARE_API_TOKEN=your-api-token
CLOUDFLARE_ACCOUNT_ID=your-account-id
```

#### 2. Push to Main Branch

```bash
git add .
git commit -m "Initial deployment"
git push origin main
```

GitHub Actions will automatically:
1. Run tests
2. Build Docker images
3. Deploy to GCP Cloud Run
4. Run database migrations
5. Deploy frontend to Cloudflare Pages

### Option B: Manual Deployment

#### 1. Build and Push Docker Images

```bash
# Set environment variables
export GCP_PROJECT_ID=knytt-prod
export GCP_REGION=us-central1
export ENVIRONMENT=prod

# Run build script
./deployment/scripts/build-and-push.sh \
  --project $GCP_PROJECT_ID \
  --region $GCP_REGION \
  --env $ENVIRONMENT
```

#### 2. Deploy Infrastructure with Terraform

```bash
cd deployment/gcp

# Initialize Terraform
terraform init

# Review the plan
terraform plan -var-file=terraform.tfvars

# Apply changes
terraform apply -var-file=terraform.tfvars
```

#### 3. Run Supabase Migrations

```bash
# Link to production project
supabase link --project-ref YOUR_PROJECT_REF

# Push migrations
supabase db push
```

#### 4. Deploy Frontend

```bash
cd frontend

# Install dependencies
npm install

# Build
npm run build

# Deploy to Cloudflare Pages (using Wrangler)
npx wrangler pages publish .next \
  --project-name=knytt-prod
```

---

## Post-Deployment

### 1. Verify Deployment

```bash
# Get the API URL from Terraform
cd deployment/gcp
export API_URL=$(terraform output -raw api_url)

# Test health endpoint
curl $API_URL/health

# Test API version
curl $API_URL/api/v1/version
```

### 2. Update Cloudflare DNS

Update the API CNAME record:
```
Type: CNAME
Name: api
Target: <your-cloud-run-url> (from terraform output)
Proxy: ON
```

### 3. Configure Custom Domain in Cloud Run

```bash
# Map custom domain
gcloud run domain-mappings create \
  --service=knytt-api-prod \
  --domain=api.knytt.com \
  --region=us-central1
```

### 4. Seed Initial Data (Optional)

```bash
# Upload sample products
python scripts/ingestion/ingest_products.py \
  --file=data/sample_products.csv \
  --environment=prod
```

### 5. Generate Initial Embeddings

```bash
# Trigger embedding generation
curl -X POST $API_URL/api/v1/admin/generate-embeddings \
  -H "Authorization: Bearer YOUR_SERVICE_KEY"
```

---

## Monitoring & Maintenance

### Google Cloud Monitoring

1. Go to **Cloud Console** → **Monitoring**
2. Create dashboards for:
   - Cloud Run metrics (CPU, memory, requests)
   - Memorystore metrics (CPU, memory, connections)
   - Storage metrics (bucket size, operations)

### Supabase Monitoring

1. Go to **Supabase Dashboard** → **Reports**
2. Monitor:
   - API requests
   - Database performance
   - Storage usage

### Cloudflare Analytics

1. Go to **Cloudflare Dashboard** → **Analytics**
2. Monitor:
   - Traffic patterns
   - Security events
   - Performance metrics

### Set Up Alerts

**GCP Alerts:**
```bash
# CPU alert
gcloud alpha monitoring policies create \
  --notification-channels=CHANNEL_ID \
  --display-name="High CPU Usage" \
  --condition-threshold-value=0.8 \
  --condition-threshold-duration=300s
```

### Log Aggregation

All logs are available in:
- **GCP**: Cloud Logging (automatic)
- **Supabase**: Project logs
- **Cloudflare**: Edge logs (Pro plan+)

---

## Troubleshooting

### Common Issues

#### 1. "Connection to Supabase failed"

**Cause**: Incorrect credentials or network issues

**Solution**:
```bash
# Verify credentials
echo $SUPABASE_URL
echo $SUPABASE_SERVICE_KEY

# Test connection
curl $SUPABASE_URL/rest/v1/ \
  -H "apikey: $SUPABASE_SERVICE_KEY"
```

#### 2. "Cloud Run service not starting"

**Cause**: Container crash or health check failure

**Solution**:
```bash
# Check logs
gcloud run services logs read knytt-api-prod \
  --region=us-central1 \
  --limit=50

# Check service details
gcloud run services describe knytt-api-prod \
  --region=us-central1
```

#### 3. "FAISS index not loading"

**Cause**: Index not generated or GCS permissions issue

**Solution**:
```bash
# Check if index exists in GCS
gsutil ls gs://YOUR_BUCKET/faiss-indices/

# Regenerate index
curl -X POST $API_URL/api/v1/admin/rebuild-index \
  -H "Authorization: Bearer YOUR_SERVICE_KEY"
```

#### 4. "Embeddings not generated"

**Cause**: Worker not running or CLIP model not loaded

**Solution**:
```bash
# Check worker logs
gcloud run services logs read knytt-worker-prod \
  --region=us-central1

# Manually trigger embedding generation
curl -X POST $API_URL/api/v1/admin/generate-embeddings \
  -H "Authorization: Bearer YOUR_SERVICE_KEY"
```

---

## Cost Optimization

### Development Environment (~$125/month)

**To minimize costs:**

1. **Scale to zero when idle:**
   ```hcl
   # In terraform main.tf
   min_instance_count = 0  # Already set
   ```

2. **Use smaller Redis instance:**
   ```hcl
   tier = "BASIC"
   memory_size_gb = 1
   ```

3. **Supabase free tier:**
   - Stay under 500 MB database
   - Monitor usage in dashboard

### Production Environment (~$655/month)

**To optimize:**

1. **Use sustained use discounts** (automatic in GCP)

2. **Enable autoscaling:**
   ```hcl
   max_instance_count = 10  # Adjust based on traffic
   ```

3. **Implement caching:**
   - Use Redis for frequent queries
   - Cache search results (5 min TTL)
   - Cache product details (1 hour TTL)

4. **Optimize images:**
   - Use Cloudflare image optimization
   - Compress images before upload
   - Use WebP format

5. **Monitor and adjust:**
   ```bash
   # Check costs
   gcloud billing accounts list
   gcloud billing projects describe knytt-prod
   ```

---

## Backup and Disaster Recovery

### Database Backups

**Supabase** (automatic):
- Free tier: No backups
- Pro tier: Daily backups (7-day retention)
- Manual backup:
  ```bash
  supabase db dump -f backup.sql
  ```

### Restore from Backup

```bash
# Restore Supabase database
supabase db reset
psql $DATABASE_URL < backup.sql
```

### FAISS Index Backups

Indices are stored in GCS with versioning enabled.

---

## Security Best Practices

1. **Never commit secrets** to Git
2. **Use environment variables** for all credentials
3. **Enable RLS** (Row Level Security) in Supabase
4. **Rotate credentials** regularly
5. **Use Cloudflare WAF** to block attacks
6. **Enable HTTPS only**
7. **Monitor logs** for suspicious activity
8. **Keep dependencies updated**

---

## Next Steps

After successful deployment:

1. ✅ Set up monitoring and alerts
2. ✅ Configure backups
3. ✅ Test all features thoroughly
4. ✅ Set up staging environment
5. ✅ Configure CI/CD for automatic deployments
6. ✅ Optimize performance based on real traffic
7. ✅ Plan for scaling

---

## Support

- **Supabase**: https://supabase.com/docs
- **GCP**: https://cloud.google.com/docs
- **Cloudflare**: https://developers.cloudflare.com
- **Knytt Issues**: https://github.com/your-username/knytt/issues

---

## License

MIT License - see LICENSE file for details.
