/* eslint-disable no-var */
import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
  var versityCheck: string | undefined;
}
export const db = globalThis.prisma || new PrismaClient();

globalThis.prisma = db;
globalThis.versityCheck = "global this passed!";