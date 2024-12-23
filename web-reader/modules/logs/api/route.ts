/* eslint-disable no-var */
"use server";

import { NextResponse } from "next/server";

var last_log_time: string | undefined;
declare global {
  var logs: string[] | undefined;
  var logs_updated: string | undefined;
}

if (!globalThis.logs) {
  globalThis.logs = [];
}

export async function GET() {
  const encoder = new TextEncoder();
  let intervalId: NodeJS.Timeout;
  let isStreamClosed = false;

  const stream = new ReadableStream({
    start(controller) {
      // Send initial logs

      intervalId = setInterval(() => {
        if (!isStreamClosed) {
          if (globalThis.logs_updated && globalThis.logs_updated != last_log_time) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(globalThis.logs)}\n\n`));
            last_log_time = globalThis.logs_updated;
            try {
              // addLog(`Server time: ${new Date().toISOString()}`);
              controller.enqueue(encoder.encode(`data: ${JSON.stringify(globalThis.logs)}\n\n`));
            } catch (error) {
              console.error("Error sending logs:", error);
              clearInterval(intervalId);
              controller.close();
              isStreamClosed = true;
            }
          }
        }
      }, 1000);
    },
    cancel() {
      clearInterval(intervalId);
      isStreamClosed = true;
    }
  });

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
} 