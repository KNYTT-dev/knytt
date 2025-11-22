# Apply Celery Worker Min Instances Fix

## 🎯 What Was Changed

The Celery worker's `min_instance_count` was changed from `0` to `1` in the Terraform configuration.

**File:** `deployment/gcp/main.tf` (line 470)

```terraform
# Before
min_instance_count = 0

# After
min_instance_count = 1  # Keep at least 1 worker running to process Celery tasks from Redis
```

---

## 🚀 How to Apply

### **Option 1: Apply via Terraform (Recommended)**

```bash
cd deployment/gcp

# Review the change
terraform plan

# Apply the change
terraform apply
```

**What this does:**
- Updates the `knytt-worker-prod` service
- Sets minimum instances to 1
- Keeps this configuration across future deployments

---

### **Option 2: Verify Current State**

Check if the manual change is still active:

```bash
gcloud run services describe knytt-worker-prod \
  --region us-central1 \
  --project knytt-backend \
  --format json | jq '.spec.template.spec.minInstances'
```

**Expected output:** `1`

If it shows `null` or `0`, the manual change was overwritten and you need to apply via Terraform.

---

## ⚠️ Important Notes

1. **Don't use manual `gcloud` commands** for this setting anymore
   - Manual changes get overwritten on next Terraform deployment
   - Always update Terraform configuration instead

2. **Cost Impact**
   - Before: $0/month (scaled to zero, but didn't work)
   - After: ~$20-30/month (1 small instance running 24/7)
   - **Worth it!** Your Celery tasks now process in real-time

3. **Why This Fix Is Needed**
   - Cloud Run scales based on HTTP requests
   - Celery workers poll Redis (no HTTP)
   - With `minInstances: 0`, workers shut down and never wake up
   - Tasks pile up in Redis but are never processed

---

## ✅ Verification

After applying, verify the worker is running:

```bash
# Check worker status
gcloud run services describe knytt-worker-prod \
  --region us-central1 \
  --project knytt-backend

# Check worker logs (should show it's processing tasks)
gcloud logging read 'resource.labels.service_name=knytt-worker-prod' \
  --limit 20 \
  --project knytt-backend
```

---

## 🧪 Test It

1. Add a product to favorites on production
2. Check worker logs - you should see:
   ```
   Task tasks.update_user_embedding[...] received
   Updated user embedding for ...
   ✓ Invalidated N recommendation cache entries
   Task succeeded in 0.2s
   ```

Done! 🎉

