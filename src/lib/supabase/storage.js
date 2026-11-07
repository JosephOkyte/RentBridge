import { createClient } from './client';
import { createAdminClient } from './admin';

export const BUCKET_PUBLIC_PHOTOS = 'property-showcase';
export const BUCKET_LEGAL_VAULT = 'legal-vault';

/**
 * Upload a property photo to Supabase public storage bucket
 * Used for street views, gate entrance, and interior walkthroughs
 */
export async function uploadPropertyPhoto(file, propertyId, photoTag = 'street_view') {
  const supabase = createClient();
  const fileExt = file.name.split('.').pop();
  const fileName = `${propertyId}/${Date.now()}_${photoTag.replace(/\s+/g, '_').toLowerCase()}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from(BUCKET_PUBLIC_PHOTOS)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (error) {
    throw new Error(`Supabase photo upload error: ${error.message}`);
  }

  // Get public CDN URL
  const { data: publicUrlData } = supabase.storage
    .from(BUCKET_PUBLIC_PHOTOS)
    .getPublicUrl(fileName);

  return {
    bucketPath: fileName,
    publicUrl: publicUrlData.publicUrl,
    tag: photoTag,
  };
}

/**
 * Upload confidential title deed (C of O / Governor Consent / POA / NBA Seal)
 * Stored in private bucket with strict access control
 */
export async function uploadDeedDocument(file, propertyId, listerId) {
  const supabase = createClient();
  const fileExt = file.name.split('.').pop();
  const fileName = `${listerId}/${propertyId}_deed_${Date.now()}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from(BUCKET_LEGAL_VAULT)
    .upload(fileName, file, {
      cacheControl: '0',
      upsert: true,
    });

  if (error) {
    throw new Error(`Supabase deed upload error: ${error.message}`);
  }

  return {
    bucketPath: fileName,
    fileName: file.name,
  };
}

/**
 * Generate a temporary signed URL for admin audit inspection
 * Valid for 1 hour only (prevents public link leakage)
 */
export async function getSignedDeedUrl(bucketPath, expiresInSeconds = 3600) {
  const adminClient = createAdminClient();
  const { data, error } = await adminClient.storage
    .from(BUCKET_LEGAL_VAULT)
    .createSignedUrl(bucketPath, expiresInSeconds);

  if (error) {
    throw new Error(`Signed URL generation error: ${error.message}`);
  }

  return data.signedUrl;
}

