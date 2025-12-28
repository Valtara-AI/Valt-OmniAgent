import type { NextRequest } from 'next/server'

// Placeholder catch-all auth route.
// This file previously was empty which caused Next's type generation to import
// it as a module but find no exports. We export minimal handlers so the
// build/type-generation step treats this as a valid module.

export async function GET(_req: NextRequest) {
	return new Response('Not Found', { status: 404 })
}

export async function POST(_req: NextRequest) {
	return new Response('Not Found', { status: 404 })
}

// If you plan to enable NextAuth or other auth handlers, replace the above
// placeholder handlers with the appropriate implementation.
