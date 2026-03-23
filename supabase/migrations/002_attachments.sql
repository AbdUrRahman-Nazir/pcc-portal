-- Phase 2: Add attachment and voice support to queries table
-- Run these in Supabase SQL Editor

-- Add columns for file attachments
ALTER TABLE public.queries ADD COLUMN IF NOT EXISTS attachment_urls TEXT[];
ALTER TABLE public.queries ADD COLUMN IF NOT EXISTS voice_url TEXT;

-- Create storage bucket for query attachments (images + voice)
-- Run this via Supabase Dashboard > Storage > New Bucket
-- Bucket name: query-attachments
-- Public: true (so files can be accessed via URL)
-- File size limit: 10MB
-- Allowed MIME types: image/jpeg, image/png, image/webp, audio/webm, audio/ogg, audio/mp4
