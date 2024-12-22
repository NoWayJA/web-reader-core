import { db } from "@/db/db";
import { QueueStatus } from "@prisma/client";

// GET endpoint - Retrieves the next pending queue item
export async function GET() {
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
        return new Response(JSON.stringify({ queue: "empty" }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    return new Response(JSON.stringify(queue), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}

// POST endpoint - Updates queue status and optionally creates an entry
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { queueId, status, entry } = body;

        // Validate required fields and status enum
        if (!queueId || !status || !Object.values(QueueStatus).includes(status)) {
            return new Response('Invalid request body', { status: 400 });
        }

        // Use transaction to ensure data consistency
        const result = await db.$transaction(async (tx) => {
            // Update queue item status
            const updatedQueue = await tx.queue.update({
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
            if (status === 'COMPLETED' && entry) {
                await tx.entry.create({
                    data: {
                        ...entry,
                        urlId: updatedQueue.url.id,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }
                });
            }

            return updatedQueue;
        });

        return new Response(JSON.stringify(result), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Error updating queue status:', error);
        return new Response('Internal server error', { status: 500 });
    }
}
