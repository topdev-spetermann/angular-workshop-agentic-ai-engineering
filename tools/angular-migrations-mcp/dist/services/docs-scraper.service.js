export class DocsScraperService {
    MIGRATIONS_DATA = [
        {
            name: 'standalone-migration',
            version: '15.2+',
            description: 'Migrates to standalone components, removes NgModules',
            command: 'ng generate @angular/core:standalone-migration',
            category: 'standalone',
            breakingChanges: [
                'NgModules are removed',
                'bootstrap is changed to bootstrapApplication'
            ],
            manualSteps: [
                'Review generated code',
                'Update lazy-loaded routes',
                'Check for circular dependencies'
            ]
        },
        {
            name: 'standalone',
            version: '17+',
            description: 'Convert components to standalone',
            command: 'ng generate @angular/core:standalone',
            category: 'standalone'
        },
        {
            name: 'control-flow-migration',
            version: '17+',
            description: 'Migrates to new control flow syntax (@if, @for, @switch)',
            command: 'ng generate @angular/core:control-flow-migration',
            category: 'control-flow',
            breakingChanges: [
                '*ngIf replaced with @if',
                '*ngFor replaced with @for',
                '*ngSwitch replaced with @switch'
            ],
            manualSteps: [
                'Review complex template logic',
                'Test all conditional rendering'
            ]
        },
        {
            name: 'signal-migration',
            version: '17.1+',
            description: 'Migrates to Angular Signals',
            command: 'ng generate @angular/core:signal-migration',
            category: 'signals',
            breakingChanges: [
                'Properties converted to signals',
                'Change detection strategy may change'
            ],
            manualSteps: [
                'Update computed values',
                'Review effects',
                'Update template bindings'
            ]
        },
        {
            name: 'inject-migration',
            version: '14+',
            description: 'Migrates to inject() function',
            command: 'ng generate @angular/core:inject-migration',
            category: 'inject',
            breakingChanges: [
                'Constructor injection replaced with inject()'
            ],
            manualSteps: [
                'Verify dependency injection works',
                'Update tests'
            ]
        },
        {
            name: 'signal-input-migration',
            version: '17.1+',
            description: 'Migrates @Input() to input() signals',
            command: 'ng generate @angular/core:signal-input-migration',
            category: 'signals',
            breakingChanges: [
                '@Input() decorators replaced with input() function'
            ]
        },
        {
            name: 'output-migration',
            version: '17.3+',
            description: 'Migrates @Output() to output() function',
            command: 'ng generate @angular/core:output-migration',
            category: 'signals',
            breakingChanges: [
                '@Output() decorators replaced with output() function',
                'EventEmitter replaced with OutputEmitterRef'
            ]
        }
    ];
    async listAvailableMigrations() {
        return this.MIGRATIONS_DATA;
    }
    async getMigrationDetails(migrationName) {
        const migration = this.MIGRATIONS_DATA.find(m => m.name === migrationName);
        return migration || null;
    }
    async getMigrationsByCategory(category) {
        return this.MIGRATIONS_DATA.filter(m => m.category === category);
    }
    async searchMigrations(query) {
        const lowerQuery = query.toLowerCase();
        return this.MIGRATIONS_DATA.filter(m => m.name.toLowerCase().includes(lowerQuery) ||
            m.description.toLowerCase().includes(lowerQuery));
    }
}
