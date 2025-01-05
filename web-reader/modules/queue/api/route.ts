/* eslint-disable no-var */
import { db } from "@/db/db";
import { QueueStatus } from "@prisma/client";

// Import the global logs type
declare global {
    var logs: string[] | undefined;
}

// Helper function to add logs
function addLog(message: string) {
    if (globalThis.logs) {
        globalThis.logs_updated = new Date().toISOString();
        globalThis.logs.push(`${message} ${globalThis.logs_updated}`);
        if (globalThis.logs.length > 50) {
            globalThis.logs.shift();
        }
    }
}

// GET endpoint - Retrieves the next pending queue item
export async function GET() {
    addLog(`Queue API: Fetching next pending queue item`);
    const queue = await db.queue.findFirst({
        // Include related data with nested relationships
        include: {
            url: {
                include: {
                    configuration: {
                        include: {
                            fields: {
                                include: {
                                    child: true
                                }
                            }
                        }
                    }
                }
            }
        },
        where: { status: 'PENDING' },
        orderBy: { actAfter: 'asc' }  // Get earliest scheduled item first
    });
    // Return queue empty if no pending items found
    if (!queue) {
        addLog(`Queue API: No pending items found`);
        return new Response(JSON.stringify({ queue: "empty" }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    addLog(`Queue API: Found pending item with ID ${queue.id}`);
    return new Response(JSON.stringify(queue), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}

// POST endpoint - Updates queue status and optionally creates an entry
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { queueId, status, fieldData } = body;

        addLog(`Queue API: Updating queue item ${queueId} to status ${status}`);

        // Validate required fields and status enum
        if (!queueId || !status || !Object.values(QueueStatus).includes(status)) {
            return new Response('Invalid request body', { status: 400 });
        }


        // Update queue item status
        const updatedQueue = await db.queue.update({
            where: { id: queueId },
            data: {
                status: status,
                updatedAt: new Date()
            },
            include: {
                url: true
            }
        });

        // Create entry record if queue is completed and entry data provided
        if (status === 'COMPLETED' && fieldData) {

            addLog(`Queue API: Creating new entry for URL ${updatedQueue.url.id}`);
            await db.entry.upsert({
                where: {
                    urlId: updatedQueue.url.id
                },
                create: {
                    urlId: updatedQueue.url.id,
                    fieldData: fieldData,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                update: {
                    fieldData: fieldData,
                    updatedAt: new Date()
                }
            });
        }

        addLog(`Queue API: Successfully updated queue item ${queueId}`);
        return new Response(JSON.stringify(updatedQueue), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        addLog(`Queue API Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        console.error('Error updating queue status:', error);
        return new Response('Internal server error', { status: 500 });
    }
}
