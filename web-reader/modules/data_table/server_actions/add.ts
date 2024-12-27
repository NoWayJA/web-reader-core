'use server'

import { db } from "@/db/db";

export async function addRecord(table: string, data: any) {
  try {
    const result = await (db[table] as any).create({
      data,
    });
    return { success: true, data: result };
  } catch (error) {
    console.error('Error adding record:', error);
    return { success: false, error: 'Failed to add record' };
  }
} 