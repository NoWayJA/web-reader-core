/* eslint-disable no-var */

// The throttle module is here to prevent the same worker group from accessing the same source too frequently.
// This is to prevent overloading the source and to prevent rate limiting.

// @todo: we should be able to optionally switch  using redis rather than globalThis.Sources
// @todo: we should be able to optionally switch to using a database rather than globalThis.Soures
// This is to allow for scalability and to allow for more complex throttling rules.

/**
 * Minimum time (in milliseconds) between accesses to the same source by the same worker group
 * Defaults to 10 seconds if not set in environment variables
 */
const min_spacing = parseInt(process.env.THROTTLE_MIN_SPACING || "10000");

/**
 * Represents a single activity record for source access tracking
 */
type Activity = {
    source: string;        // Identifier for the content source
    worker_group: string;  // Identifier for the worker group
    last_access: number;   // Timestamp of last access
}

// Add type declaration for global
declare global {
    var Sources: Activity[];
    var last_activity_length: number;
}

// Initialize global activity tracking if not exists
if (!globalThis.Sources) {
    globalThis.Sources = [] as Activity[];
}

// Initialize activity length tracker if not exists
if (!globalThis.last_activity_length) {
    globalThis.last_activity_length = 0;
}

/**
 * Cleanup interval (runs every 10 minutes)
 * Maintains memory efficiency by keeping only the new activities
 * since last cleanup using array slicing
 */
setInterval(() => {
    const current_activity_length = globalThis.Sources.length;
    const new_items = current_activity_length - globalThis.last_activity_length;
    if (new_items > 0) {
        globalThis.Sources = globalThis.Sources.slice(-new_items);
        console.log("Ten minute activity cleanup");
        console.log(`Keeping ${new_items} recent items`);
    }
    globalThis.last_activity_length = globalThis.Sources.length;
}, 1000 * 60 * 10);

/**
 * Records an access attempt for a source by a worker group
 * @param source_id - Identifier for the content source
 * @param worker_group - Identifier for the worker group
 */
const recordAccess = (source: string, worker_group: string) => {
    if (!source || !worker_group) {
        throw new Error('source_id and worker_group are required');
    }
    globalThis.Sources.push({
        source: source,
        worker_group: worker_group,
        last_access: Date.now(),
    });
}

/**
 * Checks if access should be throttled based on recent activity
 * @param source_id - Identifier for the content source
 * @param worker_group - Identifier for the worker group
 * @returns true if access should be throttled (too recent), false otherwise
 */
const shouldThrottle = (source_id: string, worker_group: string) => {   
    const last_access = globalThis.Sources.find(activity => 
        activity.source === source_id && 
        activity.worker_group === worker_group
    )?.last_access;
    return last_access && Date.now() - last_access < min_spacing;
}

export { recordAccess, shouldThrottle };

