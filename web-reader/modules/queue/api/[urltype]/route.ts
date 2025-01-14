import { NextRequest } from 'next/server'

export async function POST(
    request: NextRequest,
    context: { params: { urltype: string } }
) {
    const { urltype } =  await context.params;
    console.log("urltype", urltype);
    return Response.json({ urltype });
} 