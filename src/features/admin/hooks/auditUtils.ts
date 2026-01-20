import { StorageReference } from 'firebase/storage';

export interface AuditFile {
    path: string;
    name: string;
    timeCreated: string;
    ref: StorageReference;
}

export interface DuplicateGroup {
    hash: string;
    size: number;
    files: AuditFile[];
}

/**
 * Pure logic to sort and filter duplicates.
 * Exposed for testing purposes.
 */
export function processAuditResults(filesByHash: Map<string, DuplicateGroup>): DuplicateGroup[] {
    const results: DuplicateGroup[] = [];
    
    filesByHash.forEach((group) => {
        if (group.files.length > 1) {
            // Sort: Preferred paths (images/) first, then by date
            group.files.sort((a, b) => {
                const aIsImages = a.path.startsWith('images/');
                const bIsImages = b.path.startsWith('images/');
                
                // Rule 1: 'images/' always wins (comes first)
                if (aIsImages && !bIsImages) return -1;
                if (!aIsImages && bIsImages) return 1;
                
                // Rule 2: Older files win (keep the original)
                // Note: The previous logic was "oldest wins" for keeping?
                // Wait, usually for deduplication we want to keep the OLDEST (original) or NEWEST?
                // The code had: a.time - b.time. Ascending order.
                // So index 0 is the OLDEST.
                // "Winner is always index 0". So we keep the OLDEST file.
                // Unless one is in 'images/' and the other isn't.
                return new Date(a.timeCreated).getTime() - new Date(b.timeCreated).getTime();
            });
            results.push(group);
        }
    });

    // Sort groups by size (biggest waste first)
    results.sort((a, b) => b.size - a.size);
    
    return results;
}
