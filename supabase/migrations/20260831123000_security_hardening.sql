-- Golden Jinx Supabase security hardening
-- Mirrors production changes applied on 2026-08-31.
-- The admin UUID below is the sole authenticated back-office user.

-- Restrict site_settings writes to the admin user.
DROP POLICY IF EXISTS "Authenticated can delete site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Authenticated can insert site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Authenticated can update site settings" ON public.site_settings;

DROP POLICY IF EXISTS "Admin can insert site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admin can update site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admin can delete site settings" ON public.site_settings;

CREATE POLICY "Admin can insert site settings"
ON public.site_settings FOR INSERT TO authenticated
WITH CHECK ((SELECT auth.uid()) = '822a1667-ed3b-4de5-a832-ee1b0b2e52f5'::uuid);

CREATE POLICY "Admin can update site settings"
ON public.site_settings FOR UPDATE TO authenticated
USING ((SELECT auth.uid()) = '822a1667-ed3b-4de5-a832-ee1b0b2e52f5'::uuid)
WITH CHECK ((SELECT auth.uid()) = '822a1667-ed3b-4de5-a832-ee1b0b2e52f5'::uuid);

CREATE POLICY "Admin can delete site settings"
ON public.site_settings FOR DELETE TO authenticated
USING ((SELECT auth.uid()) = '822a1667-ed3b-4de5-a832-ee1b0b2e52f5'::uuid);

-- Restrict lead image metadata reads/deletes to the admin user.
DROP POLICY IF EXISTS "Authenticated can view lead images" ON public.lead_images;
DROP POLICY IF EXISTS "Authenticated can delete lead images" ON public.lead_images;
DROP POLICY IF EXISTS "Admin can view lead images" ON public.lead_images;
DROP POLICY IF EXISTS "Admin can delete lead images" ON public.lead_images;

CREATE POLICY "Admin can view lead images"
ON public.lead_images FOR SELECT TO authenticated
USING ((SELECT auth.uid()) = '822a1667-ed3b-4de5-a832-ee1b0b2e52f5'::uuid);

CREATE POLICY "Admin can delete lead images"
ON public.lead_images FOR DELETE TO authenticated
USING ((SELECT auth.uid()) = '822a1667-ed3b-4de5-a832-ee1b0b2e52f5'::uuid);

-- Keep lead-images publicly retrievable for compatibility with the current
-- admin UI, which stores and renders public image URLs. This should be changed
-- to a private bucket once the UI is migrated to signed URLs.
UPDATE storage.buckets
SET public = true,
    file_size_limit = 8388608,
    allowed_mime_types = ARRAY['image/jpeg','image/png','image/webp']::text[]
WHERE id = 'lead-images';

UPDATE storage.buckets
SET file_size_limit = 8388608,
    allowed_mime_types = ARRAY['image/jpeg','image/png','image/webp']::text[]
WHERE id = 'property-images';

DROP POLICY IF EXISTS "Authenticated can delete lead images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can delete lead images from storage" ON storage.objects;
DROP POLICY IF EXISTS "Admin can view lead images in storage" ON storage.objects;
DROP POLICY IF EXISTS "Public can view lead images" ON storage.objects;

CREATE POLICY "Admin can delete lead images from storage"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'lead-images'
  AND (SELECT auth.uid()) = '822a1667-ed3b-4de5-a832-ee1b0b2e52f5'::uuid
);

CREATE POLICY "Public can view lead images"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'lead-images');

-- The admin UI supports deleting properties.
DROP POLICY IF EXISTS "Admin can delete properties" ON public.properties;
CREATE POLICY "Admin can delete properties"
ON public.properties FOR DELETE TO authenticated
USING ((SELECT auth.uid()) = '822a1667-ed3b-4de5-a832-ee1b0b2e52f5'::uuid);

-- Cover the property_images foreign key for better join/delete performance.
CREATE INDEX IF NOT EXISTS property_images_property_id_idx
ON public.property_images(property_id);
