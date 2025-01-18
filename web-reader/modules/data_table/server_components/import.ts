"use server";

import { db } from "@/db/db";
import { parse } from 'csv-parse/sync';
import { revalidatePath } from 'next/cache';

interface ImportTableProps {
  params: {
    table: string;
    cols: string[];
    defaults?: string;
    unique?: string;
  };
  file: File;
}

export default async function ImportTable({ params, file }: ImportTableProps) {
  try {
    const content = await file.text();
    const records = parse(content, {
      columns: true,
      skip_empty_lines: true
    });

    // Validate that CSV columns match expected columns
    const csvColumns = Object.keys(records[0] || {});
    const missingColumns = params.cols.filter(col => !csvColumns.includes(col));

    if (missingColumns.length > 0) {
      throw new Error(`Missing required columns: ${missingColumns.join(', ')}`);
    }

    // Insert records into database
    const tableName = params.table;
    
    // Process records one by one if unique constraint is specified
    if (params.unique) {
      let insertedCount = 0;
      for (const record of records) {
        // Only include specified columns
        const data: Record<string, any> = {};
        params.cols.forEach(col => {
          data[col] = record[col];
        });

        if (params.defaults) {
          const defaults = JSON.parse(params.defaults);
          defaults.forEach((defaultValue) => {
            const [key, value] = Object.entries(defaultValue)[0];
            data[key] = value;
          });
        }

        // Check if record with unique value already exists
        const existingRecord = await (db[tableName] as any).findFirst({
          where: {
            [params.unique]: record[params.unique]
          }
        });

        // Only insert if no existing record found
        if (!existingRecord) {
          await (db[tableName] as any).create({
            data: data
          });
          insertedCount++;
        }
      }

      revalidatePath('/');
      return { 
        success: true, 
        message: `Imported ${insertedCount} records (skipped ${records.length - insertedCount} duplicates)` 
      };
    } else {
      // If no unique constraint, use createMany as before
      await (db[tableName] as any).createMany({
        data: records.map((record: any) => {
          const data: Record<string, any> = {};
          params.cols.forEach(col => {
            data[col] = record[col];
          });

          if (params.defaults) {
            const defaults = JSON.parse(params.defaults);
            defaults.forEach((defaultValue) => {
              const [key, value] = Object.entries(defaultValue)[0];
              data[key] = value;
            });
          }
          return data;
        }),
        skipDuplicates: true
      });

      revalidatePath('/');
      return { success: true, message: `Imported ${records.length} records` };
    }

  } catch (error) {
    console.error('Import error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to import data'
    };
  }
}
