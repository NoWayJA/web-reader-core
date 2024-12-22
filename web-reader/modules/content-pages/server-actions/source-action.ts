"use server";

import { db } from "@/db/db";

const queueSource = async (sourceId: string) => {
    console.log("queueSource", sourceId);
    const source = await db.queue.findUnique({ where: { urlId: sourceId } });
    if (!source) {
        await db.queue.create({ data: { urlId: sourceId, status: 'PENDING', actAfter: new Date() } });
        return { success: 'Source added to queue' };
    }
    else {
        await db.queue.update({ where: { urlId: source.urlId }, data: { status: 'PENDING', actAfter: new Date() } });
        return { success: 'Source already in queue status updated' };
    }
};

export { queueSource };