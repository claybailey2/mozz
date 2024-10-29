#!/bin/bash

# Set script to exit on error
set -e

# Load environment variables from supabase.env
if [ -f "$(dirname "$0")/.env" ]; then
  export $(cat "$(dirname "$0")/.env" | xargs)
fi

npx supabase login --token $SUPABASE_TOKEN
npx supabase link --project-ref $SUPABASE_PROJECT_REF --password $SUPABASE_DB_PASSWORD

# Export the schema
npx supabase db dump -f "$(dirname "$0")/init.sql"

# Clean up the file (remove specific data)
if [[ "$OSTYPE" == "darwin"* ]]; then
  # macOS version
  sed -i '' '/^INSERT INTO/d' "$(dirname "$0")/init.sql"
  sed -i '' '/^COPY/d' "$(dirname "$0")/init.sql"
  sed -i '' '/^SELECT/d' "$(dirname "$0")/init.sql"
else
  # Linux version
  sed -i '/^INSERT INTO/d' "$(dirname "$0")/init.sql"
  sed -i '/^COPY/d' "$(dirname "$0")/init.sql"
  sed -i '/^SELECT/d' "$(dirname "$0")/init.sql"
fi

# Add warning header
echo "-- WARNING: This file is auto-generated. Do not edit directly.
-- Generated on $(date)

" | cat - "$(dirname "$0")/init.sql" > "$(dirname "$0")/temp" && mv "$(dirname "$0")/temp" "$(dirname "$0")/init.sql"

echo "Schema exported successfully!"