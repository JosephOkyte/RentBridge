# RentBridge: Cloud Integration & Environment Setup Guide

This guide details how to configure **Clerk** (User & Role Management), **Supabase** (Database & Storage), and **Resend** (Transactional Mail) for RentBridge.

---

## 📁 Environment Files Overview

* `env/.env.local.example`: Template for local machine development. Copy to `.env.local`.
* `env/.env.development.example`: Template for staging / preview deployments.
* `env/.env.production.example`: Template for live production deployment (`rentbridge.ng`).

---

## 1. 👤 Clerk Setup (Authentication & Role Management)

1. **Create Clerk Application:**
   * Go to [https://dashboard.clerk.com/](https://dashboard.clerk.com/) and create a project named **RentBridge**.
   * Under **User & Authentication > Email, Phone, Username**:
     * Set **Email address** to **Required** and **Unique**.
     * Enable **Phone number** (recommended for Nigerian SMS/WhatsApp verification).
2. **Retrieve API Keys:**
   * Go to **API Keys** and copy:
     * `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (starts with `pk_test_` or `pk_live_`)
     * `CLERK_SECRET_KEY` (starts with `sk_test_` or `sk_live_`)
3. **Configure Webhook (Syncs users to Supabase):**
   * In Clerk Dashboard, go to **Webhooks** > **Add Endpoint**.
   * URL: `https://your-domain.com/api/webhooks/clerk` (or your local ngrok/localtunnel URL for local testing).
   * Subscribe to events: `user.created`, `user.updated`, `user.deleted`.
   * Copy the **Signing Secret** into `CLERK_WEBHOOK_SECRET` (starts with `whsec_`).

---

## 2. 🗄️ Supabase Setup (PostgreSQL Database & Media Storage)

1. **Create Supabase Project:**
   * Go to [https://supabase.com/dashboard](https://supabase.com/dashboard) and create a project named **RentBridge**.
2. **Execute Database Migration:**
   * Open the **SQL Editor** in your Supabase dashboard.
   * Copy and run the entire script from:
     [`supabase/migrations/20261105000000_init_rentbridge_schema.sql`](../supabase/migrations/20261105000000_init_rentbridge_schema.sql)
   * This creates all tables (`profiles`, `properties`, `property_media`, `compliance_records`, `inspections`, `admin_audit_logs`) and enforces multi-tenant Row-Level Security (RLS).
3. **Create Storage Buckets:**
   * In Supabase Dashboard, navigate to **Storage** > **New Bucket**:
     1. **`property-showcase`**:
        * Set as **Public** bucket.
        * Used for the 12/17 street and interior transparency photos.
     2. **`legal-vault`**:
        * Set as **Private** bucket.
        * Used for confidential C of O, Governor's Consent, and Lawyer Bar seals.
4. **Retrieve API Keys:**
   * Go to **Project Settings** > **API**:
     * `NEXT_PUBLIC_SUPABASE_URL`
     * `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     * `SUPABASE_SERVICE_ROLE_KEY` *(Keep secret! Used strictly server-side for stealth admin audits)*.

---

## 3. ✉️ Resend Setup (Transactional Mail & Anti-Fraud Alerts)

1. **Create Resend Account:**
   * Sign up at [https://resend.com/](https://resend.com/).
2. **Generate API Key:**
   * Go to **API Keys** > **Create API Key**.
   * Copy key to `RESEND_API_KEY` (starts with `re_`).
3. **Verify Domain (Production):**
   * In Resend Dashboard, go to **Domains** > **Add Domain** (`rentbridge.ng`).
   * Add the provided DKIM and SPF records to your DNS provider.
   * Once verified, set `EMAIL_FROM="RentBridge Nigeria <notifications@rentbridge.ng>"`.
   * *(Note: In local testing, you can use `onboarding@resend.dev` to send test emails to your own registered email address)*.

---

## ⚡ Quick Start Checklist

```bash
# 1. Copy local template
cp env/.env.local.example .env.local

# 2. Paste your keys into .env.local

# 3. Start development server
npm run dev
```

