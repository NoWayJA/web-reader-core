import React from 'react';
import DataTable from '@/web-reader/modules/data_table/server_components/data_table';

// Define proper types for the page props
interface PageProps {
    searchParams: { [key: string]: string | string[] | undefined }
}

// Convert to Server Component and properly type the props
const Queue = async ({ searchParams }: PageProps) => {
    const {page} = await searchParams;
    const pageNumber = page ? Number(page) : undefined;
    
    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Queue</h1>
                    <p className="mt-2 text-gray-600">
                        Manage your queue
                    </p>
                </div>
                
                <div className="bg-white rounded-lg shadow">
                    <div className="p-6">
                        <DataTable  
                            params={{
                                table: "queue",
                                cols: ["status",  "retries", "actAfter"],
                                children: ["url"],
                                page: pageNumber
                            }}
                        />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Queue;