import { createClient } from '@sanity/client';

export const readClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: 'production',
  apiVersion: '2023-06-01',
  useCdn: true, // For faster reads
});
