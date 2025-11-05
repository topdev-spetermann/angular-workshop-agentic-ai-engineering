import { z } from 'zod';
import { AngularCliService } from '../services/angular-cli.service.js';
import { DocsScraperService } from '../services/docs-scraper.service.js';

export const CheckStatusSchema = z.object({});

export async function checkMigrationStatus(args: z.infer<typeof CheckStatusSchema>, workspaceRoot: string) {
  const cliService = new AngularCliService(workspaceRoot);
  const docsService = new DocsScraperService();

  // Check if it's an Angular project
  const isAngular = await cliService.isAngularProject();
  if (!isAngular) {
    throw new Error('Not an Angular project. angular.json not found.');
  }

  // Get current version
  const currentVersion = await cliService.getCurrentVersion();

  // Get available updates
  const updatesOutput = await cliService.checkAvailableUpdates();

  // Get all available migrations
  const allMigrations = await docsService.listAvailableMigrations();

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(
          {
            currentVersion,
            availableUpdates: updatesOutput,
            totalMigrations: allMigrations.length,
            migrations: allMigrations.map(m => ({
              name: m.name,
              version: m.version,
              description: m.description
            }))
          },
          null,
          2
        )
      }
    ]
  };
}
