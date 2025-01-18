import { db } from "@/db/db";
import { QueueStatus } from "@prisma/client";
import { NextRequest } from 'next/server'

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

export async function POST(
    request: NextRequest,
    context: { params: { urltype: string } }
) {
    const { urltype } =  await context.params;
    switch (urltype) {
        case "list":
            const body = await request.json();
            const { queueId, status, fieldData } = body;
            console.log("queueId", queueId);
            console.log("status", status);
            console.log("fieldData", fieldData);
            
            try {
                const { success, contentAmount, regex } = JSON.parse(fieldData);
                console.log("success", success);
                console.log("contentAmount", contentAmount);
                console.log("regex", regex);
                if (status === "completed") {
                    console.log("completed");
                }
            } catch (error) {
                console.error("Error parsing fieldData", error);
            }

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
        addLog(`Queue API: Creating new entry for URL ${updatedQueue.url.id}`);
            return Response.json({ urltype });
        default:
            return Response.json({ urltype });
    }  
} 
