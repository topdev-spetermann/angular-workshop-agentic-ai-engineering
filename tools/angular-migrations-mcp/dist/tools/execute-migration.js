import { z } from 'zod';
import { AngularCliService } from '../services/angular-cli.service.js';
import { DocsScraperService } from '../services/docs-scraper.service.js';
export const ExecuteMigrationSchema = z.object({
    migrationName: z.string(),
    dryRun: z.boolean().optional().default(false),
    verbose: z.boolean().optional().default(false)
});
export async function executeMigration(args, workspaceRoot) {
    const cliService = new AngularCliService(workspaceRoot);
    const docsService = new DocsScraperService();
    // Validate it's an Angular project
    const isAngular = await cliService.isAngularProject();
    if (!isAngular) {
        throw new Error('Not an Angular project. angular.json not found.');
    }
    // Get migration details
    const migration = await docsService.getMigrationDetails(args.migrationName);
    if (!migration) {
        throw new Error(`Migration '${args.migrationName}' not found.`);
    }
    // Execute migration
    const result = await cliService.executeMigration(args.migrationName, {
        dryRun: args.dryRun,
        verbose: args.verbose
    });
    return {
        content: [
            {
                type: 'text',
                text: JSON.stringify({
                    migration: migration.name,
                    dryRun: args.dryRun,
                    success: !result.stderr || result.stderr.length === 0,
                    output: result.stdout,
                    errors: result.stderr,
                    nextSteps: migration.manualSteps || []
                }, null, 2)
            }
        ]
    };
}
