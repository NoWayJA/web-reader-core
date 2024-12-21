"use server";

import { db } from "@/db/db";
import Link from "next/link";
import "../styles/styles.css";

interface TableParams {
  table: string;
  page?: number;
  cols: string[];
  filter?: string;
  children?: string[];
}

export default async function DataTable({ params }: { params: TableParams }) {
  const pageSize = 10;
  const tableName = params.table;
  const page = params.page || 1;
  const offset = (page - 1) * pageSize;

  // Build where clause dynamically
  const where: Record<string, unknown> = {};
  if (params.filter) {
    const filterArray = JSON.parse(params.filter);
    filterArray.forEach((filterObj: Record<string, unknown>) => {
      const [key, value] = Object.entries(filterObj)[0];
      where[key] = value;
    });
  }

  const queryOptions: any = {
    where,
    orderBy: { id: "desc" },
    take: pageSize,
    skip: offset,
  };

  // If we have children, use include, otherwise use select
  if (params.children && params.children.length > 0) {
    const include: Record<string, boolean> = {};
    params.children.forEach(child => {
      include[child] = true;
    });
    queryOptions.include = include;
  } else {
    queryOptions.select = params.cols.reduce((acc: Record<string, boolean>, col: string) => {
      acc[col] = true;
      return acc;
    }, { id: true });
  }

  const allEntities = await (db[tableName] as any).findMany(queryOptions);

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
                {params.children?.map((child: string) => (
                  <th key={child}>{child}</th>
                ))}
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {allEntities?.map((entity: any) => (
                <tr key={entity.id}>
                  {params.cols.map((col: string) => (
                    <td key={col}>{entity[col]}</td>
                  ))}
                  {params.children?.map((child: string) => (
                    <td key={child}>
                      {entity[child]?.name || 'None'}
                    </td>
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
            <Link href={`?page=${page > 1 ? page - 1 : 1}`}>
              Previous
            </Link>
            &nbsp;
            {page}
            &nbsp;
            <Link href={`?page=${page + 1}`}>
              Next
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
