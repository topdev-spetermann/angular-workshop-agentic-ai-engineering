export interface Migration {
  name: string;
  version: string;
  description: string;
  command: string;
  category?: 'standalone' | 'signals' | 'control-flow' | 'inject' | 'general';
  breakingChanges?: string[];
  manualSteps?: string[];
}

export interface MigrationStatus {
  currentVersion: string;
  appliedMigrations: string[];
  availableMigrations: Migration[];
  pendingMigrations: Migration[];
}

export interface MigrationResult {
  success: boolean;
  message: string;
  changes?: string[];
  errors?: string[];
}
