# Knytt Quick Start Guide
## Get up and running in 15 minutes

This is the fastest way to deploy Knytt to production using Supabase + GCP + Cloudflare.

---

## Prerequisites

✅ Supabase account
✅ GCP account with billing enabled
✅ Cloudflare account
✅ Domain name (optional but recommended)

---

## Step 1: Supabase Setup (5 minutes)

### Create Project

1. Go to https://app.supabase.com
2. Click "New Project"
3. Enter:
   - Name: `knytt-prod`
   - Password: Generate strong password
   - Region: Closest to your users
4. Wait for project to be ready (~2 minutes)

### Get Credentials

1. Go to **Settings** → **API**
2. Copy these (you'll need them later):
   - Project URL
   - `anon` key
   - `service_role` key
   - Project Ref (from URL)

### Run Migrations

```bash
# Install Supabase CLI
npm install -g supabase

# Clone the repo
git clone https://github.com/your-username/knytt.git
cd knytt

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# When prompted, enter the database password you created

# Apply migrations
supabase db push
```

✅ Done! Your database is ready.

---

## Step 2: GCP Setup (5 minutes)

### Create Project

```bash
# Install gcloud CLI first: https://cloud.google.com/sdk/docs/install

# Create project
gcloud projects create knytt-prod --name="Knytt Production"

# Set active project
gcloud config set project knytt-prod

# Link billing (required)
# Go to: https://console.cloud.google.com/billing/linkedaccount?project=knytt-prod
```

### Enable APIs

```bash
gcloud services enable \
  artifactregistry.googleapis.com \
  run.googleapis.com \
  redis.googleapis.com \
  secretmanager.googleapis.com \
  vpcaccess.googleapis.com \
  cloudscheduler.googleapis.com
```

### Configure Terraform

```bash
cd deployment/gcp

# Copy example vars
cp terraform.tfvars.example terraform.tfvars

# Edit with your values
nano terraform.tfvars
```

Update:
```hcl
project_id           = "knytt-prod"
supabase_url         = "https://xxx.supabase.co"
supabase_service_key = "your-service-role-key"
supabase_anon_key    = "your-anon-key"
```

---

## Step 3: Deploy Backend (3 minutes)

### Build Docker Images

```bash
# Go back to root
cd ../..

# Set variables
export GCP_PROJECT_ID=knytt-prod
export ENVIRONMENT=prod

# Build and push (this takes ~5 minutes first time)
./deployment/scripts/build-and-push.sh \
  --project $GCP_PROJECT_ID \
  --env $ENVIRONMENT
```

### Deploy Infrastructure

```bash
cd deployment/gcp

# Deploy with Terraform
terraform init
terraform apply -auto-approve
```

This creates:
- Cloud Run services (API + Workers)
- Redis (Memorystore)
- Storage bucket
- Scheduled jobs

Save the `api_url` from the output!

---

## Step 4: Cloudflare Setup (2 minutes)

### Add Domain

1. Go to https://dash.cloudflare.com
2. Add your domain
3. Update nameservers at your registrar

### Configure Pages

1. **Pages** → **Create project** → Connect GitHub
2. Select your `knytt` repository
3. Build settings:
   - Framework: Next.js
   - Build command: `npm run build`
   - Output: `.next`
   - Root: `frontend`
4. Environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   NEXT_PUBLIC_API_URL=https://api.yourdomain.com
   ```
5. **Save and Deploy**

### Add DNS Records

1. **DNS** → **Records** → **Add record**

API (backend):
```
Type: CNAME
Name: api
Target: <cloud-run-url-from-terraform>
Proxy: ON ☁️
```

App (frontend):
```
Type: CNAME
Name: app
Target: knytt-prod.pages.dev
Proxy: ON ☁️
```

---

## Step 5: Verify Deployment (1 minute)

### Test API

```bash
curl https://api.yourdomain.com/health
# Should return: {"status":"healthy"}
```

### Test Frontend

Visit: https://app.yourdomain.com

You should see the Knytt homepage!

---

## Next Steps

### 1. Generate Embeddings

```bash
# Trigger initial embedding generation
curl -X POST https://api.yourdomain.com/api/v1/admin/generate-embeddings \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY"
```

### 2. Upload Products

```bash
# Upload a CSV of products
python scripts/ingestion/ingest_products.py \
  --file=data/sample_products.csv \
  --environment=prod
```

### 3. Configure CI/CD

Set up GitHub Actions for automatic deployments:

1. Go to **GitHub** → **Settings** → **Secrets**
2. Add all the secrets from `.github/workflows/deploy.yml`
3. Push to `main` branch to trigger deployment

### 4. Monitor

- **GCP**: https://console.cloud.google.com/run
- **Supabase**: https://app.supabase.com
- **Cloudflare**: https://dash.cloudflare.com

---

## Troubleshooting

### "Container failed to start"

Check logs:
```bash
gcloud run services logs read knytt-api-prod --region=us-central1
```

### "Database connection failed"

Verify Supabase credentials in GCP Secret Manager:
```bash
gcloud secrets versions access latest --secret=supabase-url-prod
```

### "Frontend not loading"

Check Cloudflare Pages build logs:
1. Go to Cloudflare Dashboard
2. Pages → knytt-prod → View build log

---

## Cost Estimate

**Development** (~$125/month):
- GCP Cloud Run: ~$30
- GCP Memorystore: ~$15
- GCP Storage: ~$10
- GCP Networking: ~$70
- Supabase Free: $0
- Cloudflare Free: $0

**Production** (~$655/month):
- GCP Cloud Run: ~$90
- GCP Memorystore: ~$60
- GCP Storage: ~$40
- GCP Networking: ~$100
- GCP Misc: ~$40
- Supabase Pro: $25
- Cloudflare Pro: $20
- Vertex AI (optional): $150

---

## Need Help?

- Full guide: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- Issues: https://github.com/your-username/knytt/issues
- Supabase docs: https://supabase.com/docs
- GCP docs: https://cloud.google.com/docs

---

## What's Next?

Once deployed:

1. ✅ Set up monitoring alerts
2. ✅ Configure backups
3. ✅ Add your products
4. ✅ Customize the frontend
5. ✅ Enable social login
6. ✅ Set up analytics

Happy building! 🚀
