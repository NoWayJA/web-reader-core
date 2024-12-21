"use server";

import { db } from "@/db/db";
import Link from "next/link";
import "../styles/styles.css";

export default async function DataTable({ params }:
  { params: any, searchParams: any }) {

  const pageSize = 10;
  const tableName = params.table;
  const page = params.page || 1;
  const offset = (page - 1) * pageSize;

  // Build where clause dynamically
  const where: any = {};
  if (params.filter) {
    where[params.filter] = true;  // e.g., { source: true } or { listPage: true }
  }

  const allEntities = await (db[tableName] as unknown as { findMany: any }).findMany({
    where,
    orderBy: { id: "desc" },
    select: cols(),
    take: pageSize,
    skip: offset,
  });

  function cols() {
    return params.cols.reduce((acc: any, col: string) => {
      acc[col] = true;
      return acc;
    }, { id: true });
  }

  return (
    <div>
      <div className="w-full justify-between">
        <div className="centre">
          <h1 className="page-title">
            {params.table.charAt(0).toUpperCase() + params.table.slice(1)} Table
          </h1>
        </div>
        <div className="center">
          <table>
            <thead>
              <tr>
                {params.cols.map((col: string) => (
                  <th key={col}>{col}</th>
                ))}
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(allEntities) &&
                allEntities.map((entity: any) => (
                  <tr key={entity.id}>
                    {params.cols.map((col: string) => (
                      <td key={col}>{entity[col]}</td>
                    ))}
                    <td>
                      <Link href={`/app/(home)/admin/${params.table}/edit/${entity.id}`}>
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <div className="pagination">
            <Link href={`?page=${page >1 ?page * 1 - 1 : 1}`}>
              Previous
            </Link>
            &nbsp;
            {page}
            &nbsp;
            <Link href={`?page=${page * 1 + 1}`}>
              Next
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
