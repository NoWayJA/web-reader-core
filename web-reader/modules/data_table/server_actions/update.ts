'use server'

import { db } from "@/db/db";

// Define relation fields
const RELATION_FIELDS = ['parent', 'configuration'];

export async function updateRecord(table: string, id: string, data: any) {
  try {
    const updateData: Record<string, any> = {};
    const relationships: Record<string, any> = {};

    Object.entries(data).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        // Skip existing relationship objects
        return;
      }

      const relationName = key.replace('Id', '');
      if (key.endsWith('Id') && RELATION_FIELDS.includes(relationName)) {
        if (value === '' || value === null || value === 'null') {
          relationships[relationName] = { disconnect: true };
        } else {
          relationships[relationName] = { connect: { id: value } };
        }
      } else {
        // Handle non-relation fields
        updateData[key] = value === '' ? null : value;
      }
    });

    // Remove id from updateData to prevent Prisma errors
    delete updateData.id;

    console.log("Updating with data:", { ...updateData, ...relationships });

    const result = await (db[table] as any).update({
      where: { id },
      data: {
        ...updateData,
        ...relationships
      },
    });
    
    return { success: true, data: result };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error updating record:', errorMessage);
    return { success: false, error: errorMessage };
  }
} 