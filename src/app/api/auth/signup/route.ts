import type { NextRequest } from 'next/server'

// Minimal placeholder handlers so the file is a valid module for Next's
// type generation. Replace with real signup logic when ready.

export async function POST(_req: NextRequest) {
	return new Response(JSON.stringify({ error: 'Not implemented' }), {
		status: 501,
		headers: { 'Content-Type': 'application/json' },
	})
}

export async function GET(_req: NextRequest) {
	return new Response('Method not allowed', { status: 405 })
}

