/**
* Dummy Route
 */

export async function GET() {
    return new Response("Example Placeholder response", {
        status: 200,
        headers: { 'Content-Type': 'text/plain' }
    });
}