"use server";

import { db } from "@/db/db";
import Link from "next/link";
import "../styles/styles.css";
import { TrashIcon } from '@heroicons/react/24/outline';
import { deleteRecord } from '../server_actions/delete';
import PlayAction from '../client_components/play_action';
import { updateRecord } from '../server_actions/update';
import EditButton from '../client_components/edit_button';

interface TableParams {
  table: string;
  page?: number;
  cols: string[];
  filter?: string;
  children?: string[];
  actions?: (
    | 'edit' 
    | 'delete' 
  )[];
  playAction?: { name: string; action: (id: string) => Promise<any> };
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
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                {params.cols.map((col: string) => (
                  <th key={col}>{col}</th>
                ))}
                {params.children?.map((child: string) => (
                  <th key={child}>{child}</th>
                ))}
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {allEntities?.map((entity: any) => (
                <tr key={entity.id}>
                  {params.cols.map((col: string) => (
                    <td key={col} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {entity[col]}
                    </td>
                  ))}
                  {params.children?.map((child: string) => (
                    <td key={child} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {entity[child]?.name || 'None'}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <EditButton 
                      record={entity}
                      table={params.table}
                      columns={params.cols}
                      onUpdate={updateRecord}
                    />
                    {params.playAction && (
                      <PlayAction 
                        id={entity.id}
                        action={params.playAction.action}
                      />
                    )}
                    {(!params.actions || params.actions.includes('delete')) && (
                      <form action={deleteRecord} className="ml-8 inline-block">
                        <input type="hidden" name="table" value={params.table} />
                        <input type="hidden" name="id" value={entity.id} />
                        <button
                          type="submit"
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </form>
                    )}
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
