/* eslint-disable no-var */
"use server";

import { NextResponse } from "next/server";

declare global {
  var logs: string[] | undefined;
}

if (!globalThis.logs) {
  globalThis.logs = [];
}

function addLog(message: string) {
  if (globalThis.logs) {
    globalThis.logs.push(message);
    if (globalThis.logs.length > 50) {
      globalThis.logs.shift();
    }
  }
}

export async function GET() {
  const encoder = new TextEncoder();
  let intervalId: NodeJS.Timeout;
  let isStreamClosed = false;

  const stream = new ReadableStream({
    start(controller) {
      // Send initial logs
      controller.enqueue(encoder.encode(`data: ${JSON.stringify(globalThis.logs)}\n\n`));

      intervalId = setInterval(() => {
        if (!isStreamClosed) {
          try {
            addLog(`Server time: ${new Date().toISOString()}`);
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(globalThis.logs)}\n\n`));
          } catch (error) {
            console.error("Error sending logs:", error);
            clearInterval(intervalId);
            controller.close();
            isStreamClosed = true;
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