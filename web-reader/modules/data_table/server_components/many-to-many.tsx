"use server";

import { db } from "@/db/db";
import ManyToManyEditButton from '../client_components/many_to_many_edit_button';
import ManyToManyAddButton from '../client_components/many_to_many_add_button';

interface ManyToManyProps {
  params: {
    parentTable: string;
    childTable: string;
    childJoin: string;
    joinTable: string;
    orderChildBy?: string;
    orderBy?: string;
    cols?: string[];
    inputTypes?: string[];
  };
}

export default async function ManyToMany({ params }: ManyToManyProps) {
  const {
    parentTable,
    childTable,
    childJoin,
    joinTable,
    orderChildBy = 'name',
    orderBy = 'name',
    cols = ['name'],
    inputTypes = ['text']
  } = params;

  // Get all records with their relationships
  const records = await (db[parentTable] as any).findMany({
    select: {
      id: true,
      ...cols.reduce((acc: any, col) => ({ ...acc, [col]: true }), {}),
      [childJoin]: {
        include: {
          child: true
        },
        orderBy: {
          child: {
            [orderChildBy]: 'asc'
          }
        }
      }
    },
    orderBy: {
      [orderBy]: 'asc'
    }
  });

  // Get all available children for selection with sorting
  const availableChildren = await (db[childTable] as any).findMany({
    orderBy: {
      [orderChildBy]: 'asc'
    }
  });

  return (
    <div className="p-4">
      <div className="mb-4">
        <ManyToManyAddButton
          availableChildren={availableChildren}
          parentTable={parentTable}
          childTable={childTable}
          joinTable={joinTable}
        />
      </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {cols.map(col => (
              <th key={col} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {col.charAt(0).toUpperCase() + col.slice(1)}
              </th>
            ))}
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {records.map((record: any) => (
            <tr key={record.id}>
              {cols.map(col => (
                <td key={col} className="px-6 py-4 text-sm text-gray-900 break-words max-w-xs">
                  {typeof record[col] === 'object' && record[col] !== null ? (
                    Array.isArray(record[col]) ?
                      <div className="flex flex-wrap gap-1">
                        {record[col].map((item: any) => (
                          <span key={item.child.id} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {item.child.name}
                          </span>
                        ))}
                      </div>
                      :
                      <div className="whitespace-pre-wrap">{JSON.stringify(record[col], null, 2)}</div>
                  ) : record[col]}
                </td>
              ))}
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <ManyToManyEditButton
                  record={record}
                  availableChildren={availableChildren}
                  currentChildren={record.fields.map((f: any) => f.child)}
                  parentTable={parentTable}
                  childTable={childTable}
                  childJoin={childJoin}
                  joinTable={joinTable}
                  cols={cols}
                  inputTypes={inputTypes}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
