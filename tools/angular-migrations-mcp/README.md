# Angular Migrations MCP Server

Model Context Protocol (MCP) server for executing Angular migrations from angular.dev.

## Features

- ✅ List all available Angular migrations
- ✅ Execute migrations with dry-run support
- ✅ Check migration status and current Angular version
- ✅ Get detailed information about specific migrations
- ✅ Support for all major Angular migration types:
  - Standalone components
  - Control Flow (@if, @for, @switch)
  - Signals (input, output, computed)
  - Inject function
  - And more...

## Installation

```bash
cd tools/angular-migrations-mcp
npm install
npm run build
```

## Configuration

Add to `.vscode/mcp.json`:

```json
{
  "servers": {
    "angular-migrations": {
      "command": "node",
      "args": ["./tools/angular-migrations-mcp/dist/index.js"]
    }
  }
}
```

## Available Tools

### 1. `list_available_migrations`

Lists all available Angular migrations.

**Parameters:**
- `category` (optional): Filter by category (standalone, signals, control-flow, inject, general)

**Example:**
```
List all available Angular migrations
List Angular signal migrations
```

### 2. `execute_migration`

Executes a specific Angular migration.

**Parameters:**
- `migrationName` (required): Name of the migration
- `dryRun` (optional, default: false): Run without making changes
- `verbose` (optional, default: false): Show verbose output

**Example:**
```
Execute the standalone-migration
Run control-flow-migration in dry-run mode
```

### 3. `check_migration_status`

Checks current Angular version and available migrations.

**Example:**
```
Check migration status
What is my current Angular version?
```

### 4. `get_migration_details`

Gets detailed information about a specific migration.

**Parameters:**
- `migrationName` (required): Name of the migration

**Example:**
```
Show details for signal-input-migration
What does the control-flow-migration do?
```

## Supported Migrations

- **standalone-migration** (15.2+) - Migrate to standalone components
- **control-flow-migration** (17+) - New template syntax (@if, @for, @switch)
- **signal-migration** (17.1+) - Migrate to Angular Signals
- **signal-input-migration** (17.1+) - Migrate @Input() to input()
- **output-migration** (17.3+) - Migrate @Output() to output()
- **inject-migration** (14+) - Convert constructor injection to inject()

## Usage in GitHub Copilot Chat

After configuration, you can use natural language:

```
"List all available Angular migrations"
"Execute the standalone migration in dry-run mode"
"Show me details about the signal-input-migration"
"Check if there are any pending migrations"
```

## Development

```bash
# Watch mode
npm run dev

# Build
npm run build

# Test manually
node dist/index.js
```

## Requirements

- Node.js 18+
- Angular CLI installed globally or in project
- Angular project with angular.json

## License

MIT
