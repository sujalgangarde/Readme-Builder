#!/usr/bin/env bash
set -e

echo "Installing dependencies..."
npm install

echo "Building Next.js app..."
npm run build

echo "Copying static assets into standalone output..."
cp -r public .next/standalone/public
cp -r .next/static .next/standalone/.next/static

echo "Build complete."
