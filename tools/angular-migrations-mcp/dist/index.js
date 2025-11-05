#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema, } from '@modelcontextprotocol/sdk/types.js';
import { listMigrations, ListMigrationsSchema } from './tools/list-migrations.js';
import { executeMigration, ExecuteMigrationSchema } from './tools/execute-migration.js';
import { checkMigrationStatus, CheckStatusSchema } from './tools/check-status.js';
import { getMigrationDetails, GetDetailsSchema } from './tools/get-details.js';
const WORKSPACE_ROOT = process.cwd();
const server = new Server({
    name: 'angular-migrations-mcp',
    version: '1.0.0',
}, {
    capabilities: {
        tools: {},
    },
});
// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: 'list_available_migrations',
                description: 'List all available Angular migrations from angular.dev',
                inputSchema: {
                    type: 'object',
                    properties: {
                        category: {
                            type: 'string',
                            description: 'Filter by category: standalone, signals, control-flow, inject, general',
                        },
                    },
                },
            },
            {
                name: 'execute_migration',
                description: 'Execute a specific Angular migration',
                inputSchema: {
                    type: 'object',
                    properties: {
                        migrationName: {
                            type: 'string',
                            description: 'Name of the migration to execute (e.g., "standalone-migration")',
                        },
                        dryRun: {
                            type: 'boolean',
                            description: 'Run in dry-run mode without making changes',
                            default: false,
                        },
                        verbose: {
                            type: 'boolean',
                            description: 'Show verbose output',
                            default: false,
                        },
                    },
                    required: ['migrationName'],
                },
            },
            {
                name: 'check_migration_status',
                description: 'Check current Angular version and available migrations',
                inputSchema: {
                    type: 'object',
                    properties: {},
                },
            },
            {
                name: 'get_migration_details',
                description: 'Get detailed information about a specific migration',
                inputSchema: {
                    type: 'object',
                    properties: {
                        migrationName: {
                            type: 'string',
                            description: 'Name of the migration',
                        },
                    },
                    required: ['migrationName'],
                },
            },
        ],
    };
});
// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    try {
        switch (request.params.name) {
            case 'list_available_migrations': {
                const args = ListMigrationsSchema.parse(request.params.arguments);
                return await listMigrations(args);
            }
            case 'execute_migration': {
                const args = ExecuteMigrationSchema.parse(request.params.arguments);
                return await executeMigration(args, WORKSPACE_ROOT);
            }
            case 'check_migration_status': {
                const args = CheckStatusSchema.parse(request.params.arguments);
                return await checkMigrationStatus(args, WORKSPACE_ROOT);
            }
            case 'get_migration_details': {
                const args = GetDetailsSchema.parse(request.params.arguments);
                return await getMigrationDetails(args);
            }
            default:
                throw new Error(`Unknown tool: ${request.params.name}`);
        }
    }
    catch (error) {
        if (error instanceof Error) {
            return {
                content: [
                    {
                        type: 'text',
                        text: `Error: ${error.message}`,
                    },
                ],
                isError: true,
            };
        }
        throw error;
    }
});
// Start server
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('Angular Migrations MCP Server running on stdio');
}
main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
});
