import { db } from "@/db/db";
import { QueueStatus } from "@prisma/client";
import { NextRequest } from 'next/server'
import { isValidRegex, addLog } from "@/web-reader/modules/queue/library/queue-helpers";
import { enqueue } from "@/web-reader/modules/queue/server_services/enqueue";
type LinkData = {
    url: string;
    text: string;
};

export async function POST(
    request: NextRequest,
    context: { params: { urltype: string } }
) {
    const { urltype } = await context.params;
    switch (urltype) {
        case "list":
            const body = await request.json();
            const { queueId, status, extractedData, listOfLinks, type } = body;
            const queueItem = await db.queue.findUnique({
                where: { id: queueId },
                include: {
                    url: {
                        include: {
                            configuration: true
                        }
                    }
                }
            });

            try {
                switch (type) {
                    case "regex":
                        const { success, contentAmount, regex } = JSON.parse(extractedData);
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
                        break;
                    case "list":
                        // create a list of urls from the listOfLinks
                        const listOfUrls = listOfLinks.map((link: LinkData) => link.url);
                        // deduplicate the listOfUrls
                        const uniqueListOfUrls = [...new Set(listOfUrls)] as string[];
                        const existingUrls = await db.url.findMany({
                            where: {
                                url: { in: uniqueListOfUrls }
                            },
                            select: {
                                id: true,
                                url: true
                            }
                        });
                        // create a list of urls for each url in the listOfUrls which is not already in urls
                        let newLinks = listOfLinks.filter((link: LinkData) =>
                            !existingUrls.some(existingUrl => existingUrl.url === link.url));
                        //dedupe newlinks based on url
                        const uniqueNewLinks = [...new Set(newLinks.map((link: LinkData) => link.url))] as string[];
                        newLinks = uniqueNewLinks.map((url: string) => newLinks.find((link: LinkData) => link.url === url));

                        //create a new url in the database for each url in the newUrls
                        const newUrlsInDb = await db.url.createMany({
                            data: newLinks.map(link =>
                            ({
                                url: link.url,
                                name: link.text,
                                contentPage: true,
                                configurationId: queueItem?.url.configurationId
                            }))
                        });
                        // After creating URLs, get them
                        const newUrls = await db.url.findMany({
                            where: {
                                url: {
                                    in: newLinks.map(link => link.url)
                                }
                            }
                        });
                        console.log("newUrlsInDb ", newUrlsInDb.count);
                        await enqueue(newUrls);
                        break;

                    default:
                        return Response.json({ urltype });
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
