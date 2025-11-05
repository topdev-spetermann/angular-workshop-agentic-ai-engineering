import { execa } from 'execa';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

export class AngularCliService {
  private workspaceRoot: string;

  constructor(workspaceRoot: string) {
    this.workspaceRoot = workspaceRoot;
  }

  async isAngularProject(): Promise<boolean> {
    const angularJsonPath = join(this.workspaceRoot, 'angular.json');
    return existsSync(angularJsonPath);
  }

  async getCurrentVersion(): Promise<string> {
    try {
      const packageJsonPath = join(this.workspaceRoot, 'package.json');
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
      return packageJson.dependencies?.['@angular/core'] || 'unknown';
    } catch (error) {
      throw new Error('Could not read Angular version from package.json');
    }
  }

  async executeMigration(
    migrationName: string,
    options: { dryRun?: boolean; verbose?: boolean } = {}
  ): Promise<{ stdout: string; stderr: string }> {
    const args = ['generate', `@angular/core:${migrationName}`];
    
    if (options.dryRun) {
      args.push('--dry-run');
    }

    if (options.verbose) {
      args.push('--verbose');
    }

    try {
      const result = await execa('npx', ['@angular/cli', ...args], {
        cwd: this.workspaceRoot,
        reject: false
      });

      return {
        stdout: result.stdout,
        stderr: result.stderr
      };
    } catch (error) {
      throw new Error(`Migration failed: ${error}`);
    }
  }

  async checkAvailableUpdates(): Promise<string> {
    try {
      const result = await execa('npx', ['@angular/cli', 'update'], {
        cwd: this.workspaceRoot,
        reject: false
      });

      return result.stdout;
    } catch (error) {
      throw new Error(`Could not check for updates: ${error}`);
    }
  }

  async executeUpdate(
    packages: string[],
    options: { migrateOnly?: boolean; from?: string; to?: string } = {}
  ): Promise<{ stdout: string; stderr: string }> {
    const args = ['update', ...packages];

    if (options.migrateOnly) {
      args.push('--migrate-only');
    }

    if (options.from && options.to) {
      args.push(`--from=${options.from}`, `--to=${options.to}`);
    }

    try {
      const result = await execa('npx', ['@angular/cli', ...args], {
        cwd: this.workspaceRoot,
        reject: false
      });

      return {
        stdout: result.stdout,
        stderr: result.stderr
      };
    } catch (error) {
      throw new Error(`Update failed: ${error}`);
    }
  }
}
