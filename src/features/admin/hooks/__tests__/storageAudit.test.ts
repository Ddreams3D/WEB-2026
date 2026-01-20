
import { processAuditResults, DuplicateGroup } from '../auditUtils';
import { StorageReference } from 'firebase/storage';

// Mock StorageReference
const mockRef = (path: string): StorageReference => ({
    fullPath: path,
    name: path.split('/').pop() || '',
    bucket: 'test-bucket',
    parent: null,
    root: null as any,
    storage: null as any,
    toString: () => path
});

describe('processAuditResults', () => {
    it('should ignore unique files', () => {
        const filesByHash = new Map<string, DuplicateGroup>();
        filesByHash.set('hash1', {
            hash: 'hash1',
            size: 100,
            files: [
                { path: 'images/unique.jpg', name: 'unique.jpg', timeCreated: '2024-01-01', ref: mockRef('images/unique.jpg') }
            ]
        });

        const results = processAuditResults(filesByHash);
        expect(results).toHaveLength(0);
    });

    it('should detect duplicates', () => {
        const filesByHash = new Map<string, DuplicateGroup>();
        filesByHash.set('hash1', {
            hash: 'hash1',
            size: 100,
            files: [
                { path: 'images/a.jpg', name: 'a.jpg', timeCreated: '2024-01-01', ref: mockRef('images/a.jpg') },
                { path: 'products/b.jpg', name: 'b.jpg', timeCreated: '2024-01-01', ref: mockRef('products/b.jpg') }
            ]
        });

        const results = processAuditResults(filesByHash);
        expect(results).toHaveLength(1);
        expect(results[0].files).toHaveLength(2);
    });

    it('should prioritize canonical images/ path over legacy paths (Purist Rule)', () => {
        const filesByHash = new Map<string, DuplicateGroup>();
        filesByHash.set('hash1', {
            hash: 'hash1',
            size: 100,
            files: [
                { path: 'products/legacy.jpg', name: 'legacy.jpg', timeCreated: '2023-01-01', ref: mockRef('products/legacy.jpg') },
                { path: 'images/canonical.jpg', name: 'canonical.jpg', timeCreated: '2024-01-01', ref: mockRef('images/canonical.jpg') }
            ]
        });

        const results = processAuditResults(filesByHash);
        const winner = results[0].files[0];
        const loser = results[0].files[1];

        // Winner (index 0) is the one we KEEP.
        // Even though legacy.jpg is older (2023), canonical.jpg is in 'images/', so it must win.
        expect(winner.path).toBe('images/canonical.jpg');
        expect(loser.path).toBe('products/legacy.jpg');
    });

    it('should keep oldest file if both are in same root category', () => {
        const filesByHash = new Map<string, DuplicateGroup>();
        filesByHash.set('hash1', {
            hash: 'hash1',
            size: 100,
            files: [
                { path: 'images/newer.jpg', name: 'newer.jpg', timeCreated: '2024-02-01', ref: mockRef('images/newer.jpg') },
                { path: 'images/older.jpg', name: 'older.jpg', timeCreated: '2024-01-01', ref: mockRef('images/older.jpg') }
            ]
        });

        const results = processAuditResults(filesByHash);
        const winner = results[0].files[0];

        // Both are images/, so oldest wins (index 0)
        expect(winner.path).toBe('images/older.jpg');
    });
});
