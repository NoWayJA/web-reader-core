"use server";

import { db } from "@/db/db";
import ManyToManyEditButton from '../client_components/many_to_many_edit_button';
import ManyToManyAddButton from '../client_components/many_to_many_add_button';

interface ManyToManyProps {
  params: {
    parentTable: string;
    childTable: string;
    joinTable: string;
  };
}

export default async function ManyToMany({ params }: ManyToManyProps) {
  const { parentTable, childTable, joinTable } = params;

  // Get all records with their relationships
  const records = await (db[parentTable] as any).findMany({
    include: {
      fields: {
        include: {
          child: true
        }
      }
    }
  });

  // Get all available children for selection
  const availableChildren = await (db[childTable] as any).findMany();

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
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Parent Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Children
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {records.map((record: any) => (
            <tr key={record.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {record.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {record.fields.map((join: any) => (
                  <span key={join.child.id} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2">
                    {join.child.name}
                  </span>
                ))}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <ManyToManyEditButton
                  record={record}
                  availableChildren={availableChildren}
                  currentChildren={record.fields.map((f: any) => f.child)}
                  parentTable={parentTable}
                  childTable={childTable}
                  joinTable={joinTable}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
