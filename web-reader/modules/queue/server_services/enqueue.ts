import { db } from "@/db/db";
import { QueueStatus, Url } from "@prisma/client";

const enqueue = async (newLinks: Url[]) => {
    let i = 0;
    const queue = await db.queue.createMany({
        data: newLinks.map(url => ({
            urlId: url.id,
            status: QueueStatus.PENDING,
            actAfter: new Date(Date.now() + 1000 * 10 * i++)
        })),
        skipDuplicates: true
    });
    return queue;
}

export { enqueue };