// deleteAll.js
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'frpqqqak',     // 🔁 Replace with your project ID
  dataset: 'production',            // Or your dataset name
  token: 'skjRit8XsBaAwSpKhuy8K5Hx1aiOc1FafLDqo51YdXxErd0reHCFkXrIn3Jg5zVQYBNH1vN1TngfRbXOXbUhWydZ7cm0W7fjRSAMZI6POnN62MRRP7ZDNBI215ZzxKOzCGqPgkDCNKEQ3FQdBD1WR3gZFBzay5NTIK3YCZGxGpn4qnwnU6eS',        // 🔁 Must have delete access
  apiVersion: '2023-06-08',
  useCdn: false,
});
async function deleteAllDocuments() {
    try {
      // Step 1: Break references in all documents
      const docsWithRefs = await client.fetch('*[references(*._id)]{_id}');
      console.log(`🔗 Breaking references in ${docsWithRefs.length} documents...`);
  
      for (const doc of docsWithRefs) {
        await client.patch(doc._id).unset(['*']).commit();
      }
  
      // Step 2: Get all document IDs (excluding system docs)
      const allIds = await client.fetch('*[!(_id in path("_.**"))]._id');
      console.log(`🗑️ Deleting ${allIds.length} documents...`);
  
      for (const id of allIds) {
        await client.delete(id);
      }
  
      console.log('✅ All documents deleted successfully.');
    } catch (err) {
      console.error('❌ Error:', err);
    }
  }
  
  deleteAllDocuments()