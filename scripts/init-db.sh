#!/bin/bash
# Pura Esencia - Database initialization script
# Run this once after deployment to set up the database with seed data.
#
# Usage on Render:
#   1. Set DATABASE_URL environment variable in Render dashboard
#   2. Run this script in Render Shell: bash scripts/init-db.sh
#
# Local usage:
#   bash scripts/init-db.sh

set -e

echo "🌱 Pura Esencia — Database initialization"
echo "=========================================="

if [ -z "$DATABASE_URL" ]; then
  echo "❌ ERROR: DATABASE_URL environment variable is not set."
  echo "   Set it in your Render dashboard or .env file."
  exit 1
fi

echo "📊 DATABASE_URL is set (value hidden for security)"
echo ""

echo "1. Generating Prisma client..."
npx prisma generate

echo ""
echo "2. Pushing schema to database..."
npx prisma db push --accept-data-loss

echo ""
echo "3. Seeding database with Pura Esencia catalog..."
npx tsx prisma/seed.ts

echo ""
echo "✅ Database initialized successfully!"
echo ""
echo "Your Pura Esencia catalog is ready with:"
echo "  - 8 categories (jabones, velas, skincare, aceites, infusiones, baños, aromaterapia, sets)"
echo "  - 23 artisan products with brand-aligned descriptions"
echo "  - Default admin password: admin123 (change it from the admin panel)"
echo ""
echo "🔐 IMPORTANT: Change the admin password immediately after first login."
echo "   Access admin panel via the gear icon on the right side of the page."
