'use server'

import { db } from "@/db/db";

export async function updateManyToManyRelationships(
  parentId: string,
  childIds: string[],
  joinTable: string
) {
  try {
    // Delete existing relationships
    await (db[joinTable] as any).deleteMany({
      where: {
        parentId
      }
    });

    // Create new relationships
    const promises = childIds.map((childId: string) =>
      (db[joinTable] as any).create({
        data: {
          parentId,
          childId
        }
      })
    );

    await Promise.all(promises);
    return { success: true };
  } catch (error) {
    console.error('Error updating relationships:', error);
    return { success: false, error: 'Failed to update relationships' };
  }
}

export async function addManyToManyRecord(
  name: string,
  childIds: string[],
  parentTable: string,
  joinTable: string
) {
  try {
    // Create parent record
    const parent = await (db[parentTable] as any).create({
      data: {
        name
      }
    });

    // Create relationships
    const promises = childIds.map((childId: string) =>
      (db[joinTable] as any).create({
        data: {
          parentId: parent.id,
          childId
        }
      })
    );

    await Promise.all(promises);
    return { success: true };
  } catch (error) {
    console.error('Error adding record:', error);
    return { success: false, error: 'Failed to add record' };
  }
} 