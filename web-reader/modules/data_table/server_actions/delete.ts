"use server";

import { db } from "@/db/db";
import { revalidatePath } from "next/cache";

export async function deleteRecord(formData: FormData) {
  const table = formData.get('table') as string;
  const id = formData.get('id') as string;

  try {
    await (db[table] as any).delete({
      where: { id }
    });
    revalidatePath('/');
  } catch (error) {
    console.error('Delete error:', error);
  }
} 