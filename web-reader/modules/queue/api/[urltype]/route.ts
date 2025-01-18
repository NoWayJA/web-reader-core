import { db } from "@/db/db";
import { QueueStatus } from "@prisma/client";
import { NextRequest } from 'next/server'
import { isValidRegex, addLog } from "@/web-reader/modules/queue/library/queue-helpers";

export async function POST(
    request: NextRequest,
    context: { params: { urltype: string } }
) {
    const { urltype } = await context.params;
    switch (urltype) {
        case "list":
            const body = await request.json();
            const { queueId, status, fieldData } = body;
            const queueItem = await db.queue.findUnique({
                where: { id: queueId },
                include: {
                    url: true
                }
            });

            try {
                const { success, contentAmount, regex } = JSON.parse(fieldData);
                if (status === "completed" && success) {
                    console.log("successfully completed");
                    console.log("contentAmount", contentAmount);
                }
                // check if regex is not null and if it is not a valid regex
                if (regex && isValidRegex(regex) && queueItem) {
                  const updatedUrl = await db.url.update({
                        where: { id: queueItem.url.id },
                        data: {
                            listExpression: regex as string
                        }
                    });
                    console.log("updatedUrl", updatedUrl);
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
