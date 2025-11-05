import { z } from 'zod';
import { DocsScraperService } from '../services/docs-scraper.service.js';
export const ListMigrationsSchema = z.object({
    category: z.string().optional()
});
export async function listMigrations(args) {
    const docsService = new DocsScraperService();
    let migrations;
    if (args.category) {
        migrations = await docsService.getMigrationsByCategory(args.category);
    }
    else {
        migrations = await docsService.listAvailableMigrations();
    }
    return {
        content: [
            {
                type: 'text',
                text: JSON.stringify({
                    total: migrations.length,
                    migrations: migrations.map(m => ({
                        name: m.name,
                        version: m.version,
                        description: m.description,
                        command: m.command,
                        category: m.category
                    }))
                }, null, 2)
            }
        ]
    };
}
