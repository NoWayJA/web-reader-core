'use server'

import { db } from "@/db/db";

export async function updateManyToManyRelationships(
  parentId: string,
  selectedIds: string[],
  joinTable: string,
  formData: any,
  parentTable: string,
  childJoin: string
) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [childJoin]: _, ...formDataWithoutJoin } = formData;
    // Update the parent record with cleaned data
    await (db[parentTable] as any).update({
      where: { id: parentId },
      data: formDataWithoutJoin
    });
    // Update the parent record
    // await (db[parentTable] as any).update({
    //   where: { id: parentId },
    //   data: formData
    // });

    // Delete existing relationships
    await (db[joinTable] as any).deleteMany({
      where: { parentId }
    });

    // Create new relationships
    const promises = selectedIds.map((childId: string) =>
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
    console.error('Error updating record:', error);
    return { success: false, error: 'Failed to update record' };
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