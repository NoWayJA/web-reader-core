import { db } from "@/db/db";

export async function GET() {
    const queue = await db.queue.findFirst({
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
        orderBy: { actAfter: 'asc' }
    });
    if (!queue) {
        return new Response('No pending items found', { status: 204 });
    }
    return new Response(JSON.stringify(queue), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}