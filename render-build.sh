#!/usr/bin/env bash
set -e

echo "Installing dependencies..."
npm install

echo "Building Next.js app..."
npm run build

echo "Copying standalone assets..."

if [ -d "public" ]; then
  cp -r public .next/standalone/public
fi

mkdir -p .next/standalone/.next
cp -r .next/static .next/standalone/.next/static

echo "Build complete."