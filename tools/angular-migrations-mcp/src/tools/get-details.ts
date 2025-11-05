import { z } from 'zod';
import { DocsScraperService } from '../services/docs-scraper.service.js';

export const GetDetailsSchema = z.object({
  migrationName: z.string()
});

export async function getMigrationDetails(args: z.infer<typeof GetDetailsSchema>) {
  const docsService = new DocsScraperService();
  
  const migration = await docsService.getMigrationDetails(args.migrationName);
  
  if (!migration) {
    throw new Error(`Migration '${args.migrationName}' not found.`);
  }

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(migration, null, 2)
      }
    ]
  };
}
