import React from 'react';
import ManyToMany from '../../data_table/server_components/many-to-many';

// Define proper types for the page props
interface PageProps {
    searchParams: { [key: string]: string | string[] | undefined }
}

// Convert to Server Component and properly type the props
const Configurations = async ({ searchParams }: PageProps) => {
    const { page } = await searchParams;
    const pageNumber = page ? Number(page) : undefined;
    console.log(pageNumber);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Configurations</h1>
                    <p className="mt-2 text-gray-600">
                        Manage your configurations
                    </p>
                </div>

                <div className="bg-white rounded-lg shadow">
                    <div className="p-6">
                        <ManyToMany params={{
                            cols: ["name", "description","fields", "prompt", "sitePrompt", "listPrompt", "contentPrompt"],
                            inputTypes: ["text", "text", "many-to-many", "textarea", "textarea", "textarea", "textarea"],
                            parentTable: "configuration",
                            childTable: "field",
                            childJoin: "fields",
                            joinTable: "configurationFieldJoin",
                            orderBy: "weight",
                        }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Configurations;