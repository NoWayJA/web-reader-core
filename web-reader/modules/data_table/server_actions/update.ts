'use server'

import { db } from "@/db/db";
import { Prisma } from '@prisma/client';

async function getTableFields(table: string) {
  // Get the Prisma model definition
  const modelDef = (Prisma.dmmf.datamodel.models as any[])
    .find(model => model.name.toLowerCase() === table.toLowerCase());

  if (!modelDef) return {};

  // Create a map of field names to their types
  return modelDef.fields.reduce((acc: Record<string, string>, field: any) => {
    acc[field.name] = field.type;
    return acc;
  }, {});
}

export async function updateRecord(table: string, id: string, data: any) {
  try {
    const fields = await getTableFields(table);
    console.log("fields", fields);
    
    // Convert fields based on their type
    const convertedData = Object.entries(data).reduce((acc: any, [key, value]: [string, any]) => {
      if (fields[key] === 'Int') {
        // Handle integer conversion more safely
        if (value === '' || value === null || value === undefined) {
          acc[key] = null;
        } else {
          const parsed = parseInt(value, 10);
          acc[key] = isNaN(parsed) ? null : parsed;
        }
      } else {
        acc[key] = value;
      }
      return acc;
    }, {});

    const result = await (db[table] as any).update({
      where: { id },
      data: convertedData,
    });
    return { success: true, data: result };
  } catch (error) {
    console.error('Error updating record:', error);
    return { success: false, error: String(error) };  // Convert error to string
  }
} 