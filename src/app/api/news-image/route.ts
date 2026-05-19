import { NextRequest, NextResponse } from 'next/server';

// Server-side image proxy — bypasses hotlink protection on scraped education sites
// (tawjihnet.net, orientation.ma, etc.) by sending a matching Referer header.
export async function GET(req: NextRequest) {
    const url = req.nextUrl.searchParams.get('url');
    if (!url) return new NextResponse('Missing url param', { status: 400 });

    let parsed: URL;
    try {
        parsed = new URL(url);
    } catch {
        return new NextResponse('Invalid URL', { status: 400 });
    }

    try {
        const upstream = await fetch(url, {
            headers: {
                Referer: `${parsed.origin}/`,
                'User-Agent':
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                Accept: 'image/webp,image/apng,image/*,*/*;q=0.8',
                'Accept-Language': 'fr-MA,fr;q=0.9,ar;q=0.8',
            },
        });

        if (!upstream.ok) {
            return new NextResponse(null, { status: upstream.status });
        }

        const contentType = upstream.headers.get('content-type') || 'image/jpeg';
        const buffer = await upstream.arrayBuffer();

        return new NextResponse(buffer, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
                'Access-Control-Allow-Origin': '*',
            },
        });
    } catch {
        return new NextResponse('Upstream fetch failed', { status: 502 });
    }
}
