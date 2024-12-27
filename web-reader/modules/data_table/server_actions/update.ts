'use server'

import { db } from "@/db/db";

export async function updateRecord(table: string, id: string, data: any) {
  try {
    const result = await (db[table] as any).update({
      where: { id },
      data,
    });
    return { success: true, data: result };
  } catch (error) {
    console.error('Error updating record:', error);
    return { success: false, error: 'Failed to update record' };
  }
} 