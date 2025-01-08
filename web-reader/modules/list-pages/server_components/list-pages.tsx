import React from 'react';
import DataTable from '@/web-reader/modules/data_table/server_components/data_table';
import CSVUpload from '../../data_table/client_components/csv_upload';
import { queueSource } from '../server-actions/source-action';

// Define proper types for the page props
interface PageProps {
    searchParams: { [key: string]: string | string[] | undefined }
}

// Convert to Server Component and properly type the props
const ListPages = async ({ searchParams }: PageProps) => {
    const {page} = await searchParams;
    const pageNumber = page ? Number(page) : undefined;
    
    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">List Pages</h1>
                    <p className="mt-2 text-gray-600">
                        Manage your list pages and URLs
                    </p>
                </div>
                
                <div className="bg-white rounded-lg shadow">
                    <div className="p-6">
                        <DataTable 
                            params={{
                                table: "url",
                                cols: ["name", "url"],
                                child: ["configuration"],
                                page: pageNumber,
                                filter: JSON.stringify([{ listPage: true }]),
                                playAction: {
                                    name: "queue",
                                    action: queueSource
                                }
                            }}
                        />
                    </div>
                </div>

                <div className="mb-6">
                    <CSVUpload 
                        table="url" 
                        cols={["name", "url"]} 
                        defaults={JSON.stringify([{ listPage: true }])}
                    />
                </div>

            </div>
        </div>
    );
};

export default ListPages;